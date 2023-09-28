var axios = require("axios");

// all of these work.

// insert
// var data = JSON.stringify({
// 	collection: "test",
// 	database: "test",
// 	dataSource: "ResearchData",
//     document: {
//         "name": "John Sample",
//         "age": 42
//       }
// });

// find
// var data = JSON.stringify({
// 	collection: "test",
// 	database: "test",
// 	dataSource: "ResearchData",
// 	filter: { name: "John Sample" },
// });

// find many
// var data = JSON.stringify({
// 	collection: "test",
// 	database: "test",
// 	dataSource: "ResearchData",
// 	filter: { age: { $lt: 40 } },
// });

// update
// var data = JSON.stringify({
// 	collection: "test",
// 	database: "test",
// 	dataSource: "ResearchData",
// 	filter: { name: "John Sample" },
// 	update: { $set: { age: 24 } },
// });

// update many
// var data = JSON.stringify({
// 	collection: "test",
// 	database: "test",
// 	dataSource: "ResearchData",
// 	filter: { age: { $lt: 40 } },
// 	update: { $set: { age: 42 } },
// });

// delete
// var data = JSON.stringify({
// 	collection: "test",
// 	database: "test",
// 	dataSource: "ResearchData",
// 	filter: { name: "John Sample" },
// });

// insertMany
// var data = JSON.stringify({
// 	collection: "test",
// 	database: "test",
// 	dataSource: "ResearchData",
// 	documents: [
// 		{
// 			name: "John Sample",
// 			age: 42,
// 		},
// 		{
// 			name: "Mister Postman",
// 			age: 37,
// 		},
// 		{
// 			name: "Miss MongoDB",
// 			age: 35,
// 		},
// 	],
// });

var config = {
	method: "post",
	url: "https://ap-south-1.aws.data.mongodb-api.com/app/data-wjcsm/endpoint/data/v1/action/find",
	headers: {
		"Content-Type": "application/json",
		"Access-Control-Request-Headers": "*",
		"api-key":
			"oU4bPEJKAfbRwexAeSoemlJbAef70YUNMXPrusOLXh6PUEDkm71zC5rDMD0hmnFF",
	},
	data: data,
};

axios(config)
	.then(function (response) {
		console.log(JSON.stringify(response.data));
	})
	.catch(function (error) {
		console.log(error);
	});
