const mongoose = require('mongoose');

const Product = mongoose.model('product',{
	name: String,
	price: Number,
	currency: String,
	thumbnail: String,
	hover_thumbnail: String,
	category: String,
	brand: String,
	ECO: Boolean,
	returnPoints: Number,
	description: String,
	stock: Number
});

module.exports = {
	getProducts: (req,res) => {
		
		const order = req.query?.sort === 'desc' ? -1:1;
		const orderBy = ['id','name','price','stock'].indexOf(req.query?.sortBy) == -1 ? 'id';
		
		const page = req.query?.page === undefined ? 1:Math.abs(page);
		
		let results = [];
		if( req.query?.category !== undefined ) {
			
			results = Product.find({ category }).sort({ orderBy:order }).exec();
			
		}else if( req.query?.brand !== undefined ) {
			
			results = Product.find({ brand }).sort({ orderBy:order }).exec();
			
		}else if( req.query?.priceFrom !== undefined || req.query?.priceTo !== undefined ) {
			
			const from = req.query?.priceFrom === undefined ? 0:Math.abs(req.query.priceFrom);
			const searchArgs = {
				price: {$gte: from}
			};
			
			if( req.query?.priceTo !== undefined ) searchArgs.price['$lte'] = Math.abs(req.query?.priceTo);
			
			results = Product.find(searchArgs).sort({ orderBy: order });
		}
		
		res.status(200).json({
			status: 200,
			message: "Products Retrived",
			data: results.slice((page - 1) * 20,20),
			total: results.length
		});
	},
	returnProducts: (req,res) => {
		
	}
};
