export default async function handler(req, res) {


 
  
  
  
    const resp = await fetch(`https://lichess.org/api/bot/game/${req.body.gameId}/move/${req.body.move}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer lip_iv6D0kHd9JYpjZFICZXJ",
        'Content-type':'application/json'
      },
    });
  
    const respData = await resp.json();
  
    res.status(200).json(req.body);
  }
  