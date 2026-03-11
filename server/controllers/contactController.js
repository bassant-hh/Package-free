const mongoose = require('mongoose');

const Message = mongoose.model('contact',{
	name: String,
	email: String,
	phone: String,
	messag: String
});

module.exports = {
	leaveMessage: (req,res) => {
		if( req.body?.name == undefined
		||	req.body?.email == undefined
		||	req.body?.phone == undefined
		||	req.body?.message == undefined ) {
			const message = new Message({
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
				message: req.body.message
			});
			
			await message.save();
			
			res.status(201).json({
				status: 201,
				message: "Message Recieved"
			});
		}else {
			res.status(400).json({
				status: 400,
				message: "Invalid Inputs"
			});
		}
	}
};
