module.exports = {
  type: 'SQLi',
  inspectors: [
    {name:'parameter value with single character SQL syntax', 
     id:1, 
     regex: /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
     score: 1
    },
    {name:'secondsqli',
     id:2,
     regex: /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
     score: 10
    },
    {name:'thirdsqli',
     id:3,
     regex: /((\%27)|(\'))union/i,
     score:10
    },
    {name:'fouthsqli',
     id:4,
     regex: /exec(\s|\+)+(s|x)p\w+/i,
     score:10
    },
    {name:'fifthsqli',
     id:5,
     regex: /UNION(?:\s+ALL)?\s+SELECT/i,
     score:10
    } 
  ]
}
