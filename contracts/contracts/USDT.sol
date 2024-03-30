// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title Dummy USDT contract

contract USDT is ERC20 {
    constructor() ERC20("USDT", "USDT") {
    }

    function mint(uint256 amount) external{
        _mint(msg.sender, amount);
    }
}