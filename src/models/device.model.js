const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { deviceEnum } = require("../config/devices");

const versionSchema = mongoose.Schema({
  major: {
    type: Number,
  },
  minor: {
    type: Number,
  },
  patch: {
    type: Number,
  },
});

const timeOfLifeSchema = mongoose.Schema({
  days: {
    type: Number,

  },
  hours: {
    type: Number,

  },
  minutes: {
    type: Number,

  },
  bootCnt: {
    type: Number
  }
});

const portalSettingsSchema = mongoose.Schema({
  gameId: {
    type: Number,
    required: true,
  },
  portalType: {
    type: Number,
    required: true
  },
});



const deviceSchema = mongoose.Schema(
  {
    deviceName: {
      type: String,
      default: "Device X",
      trim: true,
    },
    deviceId: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      uppercase: true
    },
    deviceType: {
      type: String,
      enum: deviceEnum,
      required: true,
    },
    paired: {
      type: String,
      trim: true,
      default: null
    },
    fw: {
      type: versionSchema,
      default: {
        major: 0,
        minor: 0,
        patch: 0,
      }
    },
    tol: {
      type: timeOfLifeSchema,
      default: {
        days: 0,
        hours: 0,
        minutes: 0,
        bootCnt: 0,
      }
    },
    team: {
      type: Number,
      default: 0
    },
    // teamId: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: 'Team',
    //   default: null
    // },
    options: {
      code: {
        type: Number,
        default: 0
      },
      gameMode: {
        type: Number,
        default: 0
      },
    },
    //portalSettings: [portalSettingsSchema],
    // player: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: 'Reservation',
    //   default: null
    // }
    isHidden: {
      type: Boolean,
      default: false,
      private: true
    },
    isConnected: {
      type: Boolean,
      default: false,

    },
    deviceNumber: {
      type: Number,
      default: 254
    },
    sensitivity: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
deviceSchema.plugin(toJSON);
deviceSchema.plugin(paginate);

/**
 * Return paths to text search in paginate plugin
 * @returns {Array<string>}
 */
deviceSchema.statics.searchableFields = function () {
  return ['deviceName', 'deviceId'];
};



/**
 * @typedef Device
 */
const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;