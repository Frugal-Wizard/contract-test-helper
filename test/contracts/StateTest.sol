// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract StateTest {
    uint256 private _value;

    function add(uint256 value_) external returns (uint256) {
        _value += value_;
        return _value;
    }

    function subtract(uint256 value_) external returns (uint256) {
        _value -= value_;
        return _value;
    }
}
