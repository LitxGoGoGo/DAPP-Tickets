pragma solidity ^0.4.22;

contract Tickets {
	//定义当前彩票的期数
	uint256 public round = 0; 
	//每一期的彩票是多少钱,默认为1ether的投注金额
	uint256 public _wei = 1000000000000000000;
	//开奖时间(时间戳)
	uint256 public openTime = 0;
	//彩票池(每期的号码有哪些)
	uint256[] public numbers;
	//设置庄家(合约的部署者)
	address public minter; 
	//庄家的账号
	address public masterAccount;
	//彩票的确认池(只跟当前期数有关)
	uint256[] private currentIndexes;
	//历史结构体，字段:EOA(谁中奖了)，中奖的金额,中奖的号码
	struct History{
		address EOA;
		uint256 rewardMoney;
		uint256 number;
	}
	//用彩票的期数=>历史
	mapping(uint256=>History) public histories;
	//记录当前期数彩民参与投注的数据
	//字段: EOA表示彩民的地址，index表示当期购买的号码索引（与确认池中的索引对应）
	struct MyTicket{
		address EOA;
		uint256 index;
	}
	//记录当期期数参与投注彩民有哪些?
	mapping(uint256=>MyTicket[]) public players; 

	//构造函数设置部署者为庄家
	constructor() public {
		minter = msg.sender;
		//如果不设置，那么庄家账号默认就是部署者的账户
		masterAccount = minter;
	}
	//手动修改庄家的账户
	function setMasterAccount(address _eoa) public {
		//只有合约的部署者才能修改庄家的账户
		require(msg.sender==minter,"update master must be minter");
		masterAccount = _eoa; 
	}
	//修改每一期的投注起步价格
	function setPrice(uint256 _price) public {
		_wei = _price; 
	}

	//修改开奖时间
	function setOpenTime(uint256 _time) public {
		openTime = _time;
	}

	//设置彩票池
	function setNumbers(uint256[] randomData) public {
		//首先获取合约中有多少金额
		uint256 balanceOfContract = getContractBalance();
		//必须是合约中的金额为0才能设置彩票池
		require(balanceOfContract==0,"balanceOfContract must be zero");
		//设置彩票池
		numbers = randomData; 
		//设置彩票的当前期数
		round++; 
	}
	//获取彩票池中的号码
	function getNumbers() public view returns(uint256[]) {
		return numbers;
	}
	//获取当前合约有多少钱
	function getContractBalance() public view returns(uint256) {
		return address(this).balance; 
	}
	//判断当前期数中某一个号码的索引是否可以购买
	//如果返回true，表示当前号码可以购买
	//如果返回false，表示当前号码已经被购买了,所以彩民无法购买
	function canBuy(uint256 index) public view returns(bool) {
		bool flag = true; //表示默认可以购买
		//如果从来没有购买过，那么确认池第长度为0，表示可以直接购买
		if(currentIndexes.length==0) {
			return flag;
		}
		
		//如果已经有人购买过，那么就要遍历所有被购买过的索引
		for(uint256 i=0;i<=currentIndexes.length-1;i++) {
			if( currentIndexes[i]==index ) {
				flag = false; //设置不可以被购买
				break;
			}
		}

		return flag;

	}
	//根据期数获取某一历史的详情
	function getHistoryByRound(uint256 _round) public view returns(address,uint256,uint256) {
		History memory historyInstance = histories[_round];
		return(historyInstance.EOA,historyInstance.rewardMoney,historyInstance.number);
	}
	//返回当期参与的人数有多少人
	function getCurrentPlayersTotal() public view returns(uint256) {
		return currentIndexes.length;
	}
	//购买彩票
	function buyTicket(uint256 index) public payable{
		//1.输入的金额必须等于每期设定的金额
		require(msg.value==_wei,"msg.value must be ==_wei");
		//2.必须要有足够的彩票可供购买(彩票池>确认池表示还有彩票可以买)
		require(numbers.length>currentIndexes.length,"not enough can buy");
		//3.彩票民购买的彩票必须他人尚未购买(调用canBuy返回true表示可以购买，false不可以购买)
		require( canBuy(index),"can not buy this ticket");
		//如果购买则把号码的索引加入确认池
		currentIndexes.push(index);
		//记录本期参与的彩民
		players[round].push( MyTicket({EOA:msg.sender,index:index}) );
	}
	//返回当前确认池中已经购买过的号码索引
	function getCurrentIndexes() public view returns(uint256[]) {
		return currentIndexes;
	}

	//生成随机数
	function rand(uint256 _length) public view returns(uint256) {
		uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, now)));
		return random%_length;
	}

	//开奖（必备条件:生成随机索引）
	//1.必须庄家才可以开奖
	//2.必须要有人参与才能开奖
	//返回中奖号码和中奖账号
	function reward() public returns(address,uint256) {
		require(msg.sender==minter,"reward must be minter"); 
		require(currentIndexes.length>0,"currentIndexes.length>0");
		//获取随机索引（本质就是中奖的索引）
		uint256 randomIndex = rand( numbers.length - 1 );  
		//获取中奖号码
		uint256 rewardNumber = numbers[randomIndex];
		//找到中奖的彩民（如果没有人中奖，那么庄家通杀）
		address rewardAccount = masterAccount; 
		//获取本期参与的彩民
		MyTicket[] memory currentPlayers = players[round]; 
		//遍历所有参与本期投注的彩民
		for(uint256 i=0;i<=currentPlayers.length-1;i++){
			if(currentPlayers[i].index==randomIndex){ 
				//如果有彩民中奖了那么获奖账号就应该是彩民的账户
				rewardAccount = currentPlayers[i].EOA;
				break;
			}
		}
		//如果是彩民中奖，那么庄家分得10%的提成
		if(rewardAccount == masterAccount) {
			//记录中奖的历史
			histories[round] = History({EOA:masterAccount,rewardMoney:address(this).balance,number:rewardNumber});
			//没有人中奖，那么庄家通杀
			masterAccount.transfer( address(this).balance ); 
		}else{

			//计算10%的提成给庄家
			uint256 toMasterMoney = address(this).balance * 10/100;
			masterAccount.transfer( toMasterMoney ); 
			//记录中奖的历史
			histories[round] = History({EOA:rewardAccount,rewardMoney:address(this).balance,number:rewardNumber});
			//把剩余的钱给彩民
			rewardAccount.transfer( address(this).balance ); 
		}
		//把彩票池还原为初始化的状态
		delete numbers;
		//把确认池还原为初始化的状态
		delete currentIndexes;
		return(rewardAccount,rewardNumber);
	}
}