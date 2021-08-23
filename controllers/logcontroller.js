const Express = require('express');
const router = Express.Router();
let validateJWT = require('../middleware/validate-jwt');
const { LogModel } = require('../models');

router.get('/practice', validateJWT, (req, res) => {
  res.send("This is a practice router!")
});



router.post('/create', validateJWT, async (req, res) => {
  const { description, definition, result } = req.body.log;
  const { id } = req.user;
  const logEntry = {
    description,
    definition,
    result,
    owner_id: id
  }
  try {
    const newLog = await LogModel.create(logEntry);
    res.status(200).json(newLog);
  } catch (err) {
    res.status(500).json({
      error: err
    });
    LogModel.create(logEntry)
  }
});


router.get('/', async (req, res) => {
  try{
    const entries = await LogModel.findAll();
    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({error: err})
  }
});


router.get('/mine', validateJWT, async (req, res) => {
  let { id } = req.user;
  try{
    const userLogs = await LogModel.findAll({
      where: {
        owner_id: id
      }
    });
    res.status(200).json(userLogs);
  } catch (err) {
    res.status(500).json({ error: err})
  }
});


router.put('/update/:entryId', validateJWT, async (req, res) => {
  const { description, definition, result } = req.body.log;
  const logId = req.params.entryId;
  const userId = req.user.id;

  const query = {
    where: {
      id: logId,
      owner_id: userId
    }
  };

  const updatedLog = {
    description: description,
    definition: definition,
    result: result
  };

  try{
    const update = await LogModel.update(updatedLog, query);
    res.status(200).json(update);
  } catch (err) {
    res.status(500).json({ error: err })
  }
});

router.delete('/delete/:id', validateJWT, async (req, res) => {
  const ownerId = req.user.id;
  const logId = req.params.id;

  try {
    const query = {
      where: {
        id: logId,
        owner_id: ownerId
      }
    };
    await LogModel.destroy(query);
    res.status(200).json({message: "Log Entry Removed"})
  } catch (err) {
    res.status(500).json({error: err})
  }
})

module.exports = router;