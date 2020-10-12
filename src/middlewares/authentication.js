const jwt = require('jsonwebtoken');

module.exports = {
  async authenticateToken(request, response, next) {
    const authHeader = request.headers.authorization;
    const [scheme, token] = authHeader
      ? authHeader.split(" ")
      : [undefined, undefined];

    if (!token || token === null)
      return response.status(401).json({ error: "No token provided" });

    if (!/^Bearer$/i.test(scheme))
      return response.status(401).json({ error: "Token badformatted" });

    const validToken = await new Promise((res) => {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res(false);

        request.session = user;

        return res(true);
      });
    });

    if (validToken) return next();
    return response.status(403).json({ error: "Invalid authorization token" });
  },

  async isAdmin(request, response, next) {
    if (request.session.user.type !== 'admin') {
      response.status(403).json({ error: "access denied" });
    }
    else {
      next();
    }
  },

  async isAdminOrSelf(request, response, next) {

    console.log(request.params.id, request.session.user.id)

    const hasAuthorization = (request.session.user.type === 'admin') || (request.params.id == request.session.user.id);

    if (!hasAuthorization) {
      let message = "access denied";

      if(request.session.user.type !== "admin")
        message += " due to not being the user himself";

      response.status(403).json({ error: message });
    }
    else {
      next();
    }
  },

  async authenticateOptionalToken(request, response, next) {
    const authHeader = request.headers.authorization;
    const [scheme, token] = authHeader
      ? authHeader.split(" ")
      : [undefined, undefined];

    if (!token && !scheme) {
      const user = {}
      request.session = user; 
      return next();
    }

    if (!token || token === null)
      return response.status(401).json({ error: "No token provided" });

    if (!/^Bearer$/i.test(scheme))
      return response.status(401).json({ error: "Token badformatted" });
    

    const validToken = await new Promise((res) => {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res(false);
        
        request.session = user;

        return res(true);
      });
    });

    if (validToken) return next();
    return response.status(403).json({ error: "Invalid authorization token" });
  },
}
