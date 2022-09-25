export default async function handler(req, res) {
  const body = JSON.parse(req.body);





  const resp = await fetch("https://lichess.org/api/challenge/ai", {
    method: "POST",
    body: JSON.stringify({ 
        level: body.level,
        clock:body.clock,
        color: body.color,
        variant: 'standard',
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    }),
    headers: {
      Authorization: "Bearer lip_iv6D0kHd9JYpjZFICZXJ",
      'Content-type': 'application/json'
    },
  });

  console.log(body.color)

  const respData = await resp.json();

  res.status(200).json(respData);
}
