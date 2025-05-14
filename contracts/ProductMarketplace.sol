// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductMarketplace {
    uint public productCount = 0;

    struct Product {
        uint id;
        string title;
        string description;
        uint price;
        address payable seller;
        bool isSold;
    }

    mapping(uint => Product) public products;

    event ProductCreated(
        uint id,
        string title,
        string description,
        uint price,
        address seller
    );

    function createProduct(string memory _title, string memory _description, uint _price) public {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_price > 0, "Price must be greater than zero");

        productCount++;

        products[productCount] = Product(
            productCount,
            _title,
            _description,
            _price,
            payable(msg.sender),
            false
        );

        emit ProductCreated(productCount, _title, _description, _price, msg.sender);
    }
}
