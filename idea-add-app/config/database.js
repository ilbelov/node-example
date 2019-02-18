if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "<<CHANGEME>>"
  };
} else {
  module.exports = { 
	  mongoURI: "mongodb://localhost/vidjot-dev" 
	};
}
