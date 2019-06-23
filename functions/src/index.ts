import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
admin.initializeApp(functions.config().firebase);
const db = admin.firestore(); // Add this

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

app.get('/warmup', (request, response) => {
    response.send('Warming up');
})

app.post('/humans', async (request, response) => {
    try {
      const { name, age, isDeveloper } = request.body;
      const data = {
        name,
        age,
        isDeveloper
      } 
      const humanRef = await db.collection('humans').add(data);
      const human = await humanRef.get();
  
      response.json({
        id: humanRef.id,
        data: human.data()
        // ...data
      });
  
    } catch(error){
  
      response.status(500).send(error);
  
    }
  });


app.get('/humans/:id', async (request, response) => {
  try {
    const humanId = request.params.id;

    if (!humanId) throw new Error('Human ID is required');

    const human = await db.collection('humans').doc(humanId).get();

    if (!human.exists){
        throw new Error('Human doesnt exist.')
    }

    response.json({
      id: human.id,
      data: human.data()
    });

  } catch(error){

    response.status(500).send(error);

  }

});


app.get('/humans', async (request, response) => {
  try {

    const humanQuerySnapshot = await db.collection('humans').get();
    const humans = [];
    humanQuerySnapshot.forEach(
        (doc) => {
            humans.push({
                id: doc.id,
                data: doc.data()
            });
        }
    );

    response.json(humans);

  } catch(error){

    response.status(500).send(error);

  }

});

app.put('/humans/:id', async (request, response) => {
  try {

    const humanId = request.params.id;
    const name = request.body.name;

    if (!humanId) throw new Error('id is blank');

    if (!name) throw new Error('Name is required');
  /* tslint:disable:no-unused-variable */

    const data = { 
        name
    };
    // const humanRef = await db.collection('humans')
    //     .doc(humanId)
    //     .set(data, { merge: true });

    response.json({
        id: humanId,
        // data
    })


  } catch(error){

    response.status(500).send(error);

  }

});

app.delete('/humans/:id', async (request, response) => {
  try {

    const humanId = request.params.id;

    if (!humanId) throw new Error('id is blank');

    await db.collection('humans')
        .doc(humanId)
        .delete();

    response.json({
        id: humanId,
    })


  } catch(error){

    response.status(500).send(error);

  }

});


