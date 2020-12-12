module.exports = {
  async print(request, response) {
    try {
      const data = request;
      //console.log(data);
      return response.status(200).json({message: 'ok!'})
    } catch (error) {
      console.error(error);
      return response.status(500).json({message: 'Internal server error'})
    }
  }
}