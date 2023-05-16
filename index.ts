import express from 'express';
import bodyParser from 'body-parser';
import runAll from './experiment';

const app = express()
app.use(bodyParser.json());


export interface Transaction {
  to_address: string,
  private_key: string,
  amount: string,
  contract_address: string
  api_key: string
}


app.post('/api/broadcast-transaction', async (req, res, next) => {

  const transaction: Transaction = {
    to_address: req.body.to_address,
    private_key: req.body.private_key,
    amount: req.body.amount,
    contract_address: req.body.contract_address,
    api_key: req.body.api_key
  };
  try {
    const message = await runAll(transaction)
    res.status(201).json({
      message
    });
  } catch (error) {
    res.status(400).json({ message: error });
    next(error)
  }
});


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is listening on PORT ${port}`));


