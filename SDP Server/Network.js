var Graph = require("graphlib").Graph;
var fannet = new Graph({ directed: true, compound: true, multigraph: true });


module.exports={fannet:fannet}