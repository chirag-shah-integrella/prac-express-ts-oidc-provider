import Provider from "oidc-provider"
import express from "express"

const start = async () => {
  const app = express()

  const oidc = new Provider("http://localhost:3000", {
    async findAccount(_, id) {
      return {
        accountId: id,
        async claims(_, scope) {
          return { sub: id }
        },
      }
    },
    clients: [
      {
        client_id: "app",
        client_secret: "scorpion",
        redirect_uris: ["http://localhost:3005/cb"],
        grant_types: ["authorization_code"],
        scope: "openid",
      },
    ],
    pkce: { required: () => false, methods: ["S256"] },
  })

  app.use(oidc.callback())

  app.listen(3000, () => {
    console.log("Running on 3000")
  })
}

start()
