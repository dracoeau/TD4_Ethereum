pragma solidity >=0.4.21 <0.6.0;

import "./Roles.sol";
import "./WhitelistAdminBreeder.sol";

/**
 * @title WhitelistedRole
 * @dev Whitelisted accounts have been approved by a WhitelistAdmin to perform certain actions (e.g. participate in a
 * crowdsale). This role is special in that the only accounts that can add it are WhitelistAdmins (who can also remove
 * it), and not Whitelisteds themselves.
 */
contract WhitelistedBreeder is WhitelistAdminBreeder {
    using Roles for Roles.Role;

    event BreederAdded(address indexed account);
    event BreederRemoved(address indexed account);

    Roles.Role private _whitelisteds;

    modifier onlyWhitelistedBreeder() {
        require(isBreeder(msg.sender), "WhitelistedBreeder: caller does not have the Whitelisted role");
        _;
    }

    function isBreeder(address account) public view returns (bool) {
        return _whitelisteds.has(account);
    }

    function addBreeder(address account) public onlyWhitelistAdminBreeder {
        _addBreeder(account);
    }

    function removeBreeder(address account) public onlyWhitelistAdminBreeder {
        _removeBreeder(account);
    }

    function removeBreeder() public {
        _removeBreeder(msg.sender);
    }

    function _addBreeder(address account) internal {
        _whitelisteds.add(account);
        emit BreederAdded(account);
    }

    function _removeBreeder(address account) internal {
        _whitelisteds.remove(account);
        emit BreederRemoved(account);
    }
}