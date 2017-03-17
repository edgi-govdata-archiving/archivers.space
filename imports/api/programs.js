import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const Programs = new Mongo.Collection('programs');
export default Programs;

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('programs', () => {
    const programs = Programs.find({});
    return programs;
  });
}

function newProgram(props, userId) {
  return Object.assign({
    createdAt: new Date(),
    creator: userId,

    name: '',
    acronym: '',
    program_id: '',
  }, props);
}

Meteor.methods({
  'programs.insert': function programInsert(program) {
    check(program, String);

    const exists = Programs.findOne({ name: program.name });
    if (exists) {
      throw new Meteor.Error('program already exists');
    }

    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Programs.insert(newProgram(program, this.userId));
  },

  // eslint-disable-next-line meteor/audit-argument-checks
  'programs.update': function programUpdate(programId, changes) {
    check(programId, String);

    const program = Programs.findOne(programId);
    if (program.locked && program.locked !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    if (changes.program && changes.program !== program.program) {
      const exists = Programs.findOne({ program: changes.program });
      if (exists) {
        throw new Meteor.Error('program already exists');
      }
    }
    Programs.update(program._id, { $set: changes });
  },

  'programs.remove': function programRemove(programId) {
    check(programId, String);

    const program = Programs.findOne(programId);
    if (program.private && program.locked !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Programs.remove(programId);
  },
});
