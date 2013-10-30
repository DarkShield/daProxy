module.exports = {
  type: 'XSS',
  inspectors: [
    {
      name: 'simple tag xss',
      id: 1,
      regex: /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i,
      score: 10
    },
    {
      name: 'img src xss',
      id: 2,
      regex: /((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/i,
      score: 10
    },
    {
      name: 'general potential xss snoop',
      id: 3,
      regex: /((\%3C)|<)[^\n]+((\%3E)|>)/i,
      score: 4
    }
  ]
}