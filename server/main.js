import { Meteor } from "meteor/meteor";
import { Mongo, MongoInternals } from 'meteor/mongo';
import { onPageLoad } from "meteor/server-render";

Meteor.startup(() => {
  // Code to run on server startup.
  console.log(`Greetings from ${module.id}!`);
});

onPageLoad(sink => {
  // Code to run on every request.
  sink.renderIntoElementById(
    "server-render-target",
    `Server time: ${new Date}`
  );
});

const collection1 = new Mongo.Collection('one');

Meteor.methods({
  async testCollectionCreation() {
    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo;
    const session = await client.startSession();
    await session.startTransaction();

    try {
      const item = await collection1.rawCollection().insertOne({}, { session: session });
      // here you may want to check insertion response
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      console.error(err);
    } finally {
      session.endSession();
    }

    console.log('complete');
  }
})
