exports.create = (req, res)=>{
	nano.db.create(req.body.dbname, ()=>{
		if(err){
			res.send('Error creating a Database from routes folder');
			return;
		}
		
		res.send('Database from routes folder Connected Successfully');
	});
};