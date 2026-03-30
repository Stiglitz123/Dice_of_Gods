module.exports = {
  apps: [
    {
      name: "game-server",
      script: "dist/server/server.js",
      cwd: "/var/www/dice_of_gods",
      interpreter: "/usr/bin/node",
      node_args: "--max-old-space-size=1024"
    }
  ]
}
