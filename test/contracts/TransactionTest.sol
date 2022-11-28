// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract TransactionTest {
    uint256 private _value;

    function add(uint256 value_) external {
        _value += value_;
    }

    function value() external view returns (uint256) {
        return _value;
    }
}
