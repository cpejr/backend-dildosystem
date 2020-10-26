module.exports = {
  async print(request, response) {
    try {
      const data = request.body;
      console.log(data);
      return response.status(200).json({message: 'ok!'})
    } catch (error) {
      console.log(error);
    }
  }
}