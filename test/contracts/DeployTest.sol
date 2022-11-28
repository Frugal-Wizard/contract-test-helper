// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract DeployTest {
    uint256 private _value;

    constructor(uint256 value_) {
        _value = value_;
    }

    function value() external view returns (uint256) {
        return _value;
    }
}
