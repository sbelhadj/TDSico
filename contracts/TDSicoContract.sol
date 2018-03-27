pragma solidity ^0.4.21;

// ================= Ownable Contract start =============================
/*
 * Ownable
 *
 * Base contract with an owner.
 * Provides onlyOwner modifier, which prevents function from running if it is called by anyone other than the owner.
 */
contract Ownable {
  address public owner;

  function Ownable() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function transferOwnership(address newOwner) onlyOwner public {
    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }
}
// ================= Ownable Contract end ===============================

// ================= Safemath Contract start ============================
/*
 * Math operations with safety checks
*/
contract SafeMath {

  function safeAdd(uint256 x, uint256 y) internal pure returns(uint256) {
    uint256 z = x + y;
    assert((z >= x) && (z >= y));
    return z;
  }

  function safeSubtract(uint256 x, uint256 y) internal pure returns(uint256) {
    assert(x >= y);
    uint256 z = x - y;
    return z;
  }

  function safeMult(uint256 x, uint256 y) internal pure returns(uint256) {
    uint256 z = x * y;
    assert((x == 0)||(z/x == y));
    return z;
  }
}
// ================= Safemath Contract end ==============================

// ================= ERC20 Token Contract start =========================
/*
 * ERC20 interface
 * see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 {
  uint public totalSupply;
  function balanceOf(address who) public constant returns (uint);
  function allowance(address owner, address spender) public constant returns (uint);

  function transfer(address to, uint value) public returns (bool ok);
  function transferFrom(address from, address to, uint value) public returns (bool ok);
  function approve(address spender, uint value) public returns (bool ok);
  event Transfer(address indexed from, address indexed to, uint value);
  event Approval(address indexed owner, address indexed spender, uint value);
}
// ================= ERC20 Token Contract end ===========================

// ================= Standard Token Contract start ======================
contract StandardToken is ERC20, SafeMath {

  /**
  * @dev Fix for the ERC20 short address attack.
   */
  modifier onlyPayloadSize(uint size) {
    require(msg.data.length >= size + 4) ;
    _;
  }

  mapping(address => uint) balances;
  mapping (address => mapping (address => uint)) allowed;

  function transfer(address _to, uint _value) public onlyPayloadSize(2 * 32)  returns (bool success){
    balances[msg.sender] = safeSubtract(balances[msg.sender], _value);
    balances[_to] = safeAdd(balances[_to], _value);
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint _value) public onlyPayloadSize(3 * 32) returns (bool success) {
    uint256 _allowance = allowed[_from][msg.sender];

    balances[_to] = safeAdd(balances[_to], _value);
    balances[_from] = safeSubtract(balances[_from], _value);
    allowed[_from][msg.sender] = safeSubtract(_allowance, _value);
    emit Transfer(_from, _to, _value);
    return true;
  }

  function balanceOf(address _owner) public constant returns (uint balance) {
    return balances[_owner];
  }

  function approve(address _spender, uint _value) public returns (bool success) {
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) public constant returns (uint remaining) {
    return allowed[_owner][_spender];
  }
}
// ================= Standard Token Contract end ========================

// ================= Pausable Token Contract start ======================
/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is Ownable {
  event Pause();
  event Unpause();

  bool public paused = false;


  /**
  * @dev modifier to allow actions only when the contract IS NOT paused
  */
  modifier whenNotPaused() {
    require (!paused);
    _;
  }

  /**
  * @dev modifier to allow actions only when the contract IS paused
  */
  modifier whenPaused {
    require (paused) ;
    _;
  }

  /**
  * @dev called by the owner to pause, triggers stopped state
  */
  function pause() public onlyOwner whenNotPaused returns (bool) {
    paused = true;
    emit Pause();
    return true;
  }

  /**
  * @dev called by the owner to unpause, returns to normal state
  */
  function unpause() public onlyOwner whenPaused returns (bool) {
    paused = false;
    emit Unpause();
    return true;
  }
}
// ================= Pausable Token Contract end ========================

// ================= TDSicoToken  start =======================
contract TDSicoToken is SafeMath, StandardToken, Pausable {
  string public name;
  string public symbol;
  uint256 public decimals;
  string public version;
  address public TDSicoContract;
  
  address[] public investors;
  bool exists;

  function TDSicoToken(
    string _name,
    string _symbol,
    uint256 _decimals,
    string _version
  ) public
  {
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
    version = _version;
  }

  function transfer(address _to, uint _value) public whenNotPaused returns (bool success) {
    return super.transfer(_to,_value);
  }

  function approve(address _spender, uint _value) public whenNotPaused returns (bool success) {
    return super.approve(_spender,_value);
  }

  function balanceOf(address _owner) public constant returns (uint balance) {
    return super.balanceOf(_owner);
  }

  function setTDSicoContract(address _TDSicoContract) public onlyOwner {
    if (_TDSicoContract != address(0)) {
      TDSicoContract = _TDSicoContract;
    }
  }

  function sell(address _recipient, uint256 _value) public whenNotPaused returns (bool success) {
      assert(_value > 0);
      require(msg.sender == TDSicoContract);

      balances[_recipient] += _value;
      totalSupply += _value;
      exists = false;
      for (uint256 i = 0; i < investors.length; i++){
       if (investors[i] == _recipient) exists = true;
      }
      if ( exists == false || investors.length == 0) investors.push(_recipient);
      
      emit Transfer(0x0, owner, _value);
      emit Transfer(owner, _recipient, _value);
      return true;
  }

  function getInvestorsCount() public constant returns(uint investorsCount) {
    return investors.length;
  }

  function allInvestors() view public returns (address[]) {
    return investors;
  }
}



// ================= Ico Token Contract end =======================

// ================= Actual Sale Contract Start ====================
contract TDSicoContract is SafeMath, Pausable {
  TDSicoToken public ico;

  uint256 public tokenCreationCap;
  uint256 public totalSupply;

  address public ethFundDeposit;
  address public icoAddress;

  uint256 public fundingStartTime;
  uint256 public fundingEndTime;
  uint256 public minContribution;

  bool public isFinalized;
  uint256 public tokenExchangeRate;

  event LogCreateICO(address from, address to, uint256 val);
  

  function CreateICO(address to, uint256 val) internal returns (bool success) {
    emit LogCreateICO(0x0, to, val);
    return ico.sell(to, val);
  }

  function TDSicoContract(
    address _ethFundDeposit,
    address _icoAddress,
    uint256 _tokenCreationCap,
    uint256 _tokenExchangeRate,
    uint256 _fundingStartTime,
    uint256 _fundingEndTime,
    uint256 _minContribution
  ) public
  {
    ethFundDeposit = _ethFundDeposit;
    icoAddress = _icoAddress;
    tokenCreationCap = _tokenCreationCap;
    tokenExchangeRate = _tokenExchangeRate;
    fundingStartTime = _fundingStartTime;
    minContribution = _minContribution;
    fundingEndTime = _fundingEndTime;
    ico = TDSicoToken(icoAddress);
    isFinalized = false;
  }

  /* This function is used to purchase the tokens. Note the keyword 'payable'
   below. By just adding that one keyword to a function, your contract can
   now accept Ether from anyone who calls this function. Accepting money can
   not get any easier than this!
   */

  function buy() payable public {
    createTokens(msg.sender, msg.value);
  }

  function () payable public {    
    createTokens(msg.sender, msg.value);
  }

  /// @dev Accepts ether and creates new ICO tokens.
  function createTokens(address _beneficiary, uint256 _value) internal whenNotPaused {
    require (tokenCreationCap > totalSupply);
    require (now >= fundingStartTime);
    require (now <= fundingEndTime);
    require (_value >= minContribution);
    require (!isFinalized);

    uint256 tokens = safeMult(_value, tokenExchangeRate);
    uint256 checkedSupply = safeAdd(totalSupply, tokens);

    if (tokenCreationCap < checkedSupply) {        
      uint256 tokensToAllocate = safeSubtract(tokenCreationCap, totalSupply);
      uint256 tokensToRefund   = safeSubtract(tokens, tokensToAllocate);
      totalSupply = tokenCreationCap;
      uint256 etherToRefund = tokensToRefund / tokenExchangeRate;

      require(CreateICO(_beneficiary, tokensToAllocate));
      msg.sender.transfer(etherToRefund);
      ethFundDeposit.transfer(address(this).balance);
      return;
    }

    totalSupply = checkedSupply;

    require(CreateICO(_beneficiary, tokens)); 
    ethFundDeposit.transfer(address(this).balance);
  }

  function tokenCreationCap() view public returns (uint) {
    return tokenCreationCap;
  }
  function totalSupply() view public returns (uint) {
    return totalSupply;
  }

  /// @dev Ends the funding period and sends the ETH home
  function finalize() external onlyOwner {
    require (!isFinalized);
    // move to operational
    isFinalized = true;
    ethFundDeposit.transfer(address(this).balance);
  }
}