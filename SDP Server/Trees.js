const AVLTree = require("binary-search-tree").AVLTree;

let unameTree = new AVLTree();
let emailTree = new AVLTree();
unameTree.insert("raj");
unameTree.insert("rinku");
unameTree.insert("lolo");
emailTree.insert("hrsrk9@outlook.com");

module.exports = { unameTree , emailTree };