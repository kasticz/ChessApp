export default async function handler(req, res) {

    const body = req.body;



  
    
  
  
  
  
  
    const resp = await fetch(`https://lichess.org/api/bot/game/${body.gameId}/resign`, {
      method: "POST",
      body:JSON.stringify({gameId:body.gameId}),
      headers: {
        Authorization: "Bearer lip_iv6D0kHd9JYpjZFICZXJ",
        'Content-type': 'application/json'
      },
    });

    
    
    const respData = await resp.json();
  
    res.status(200).json(respData);
  }
  