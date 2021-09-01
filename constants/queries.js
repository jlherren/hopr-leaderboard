export const ENDPOINT = 'https://api.thegraph.com/subgraphs/id/QmYvue9jzFHPfoE6tggo9w1uJMaKFkqGinZcmxY83Gw7kA'
export const QUERY_GET_ACCOUNTS = `
  {
    accounts(first: 250, orderBy: openedChannels, orderDirection: desc) {
      id
      multiaddr
      openedChannels
      closedChannels
      hasAnnounced
    }
  }
`