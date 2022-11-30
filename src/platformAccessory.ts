import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { AntminerV9HomebridgePlatform } from './platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class AntminerV9PlatformAccessory {
  private fanService: Service;
  // private powerService: Service;

  private MAXFANSPEED = 100;
  private FanState = {
    RotationSpeed: 100,
  };

  constructor(
    private readonly platform: AntminerV9HomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Default-Manufacturer')
      .setCharacteristic(this.platform.Characteristic.Model, 'Default-Model')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    this.fanService = this.accessory.getService(this.platform.Service.Fan) || this.accessory.addService(this.platform.Service.Fan, 'fan');

    this.fanService.getCharacteristic(this.platform.Characteristic.RotationSpeed)
      .onSet(this.setRotationSpeed.bind(this))
      .onGet(this.getRotationSpeed.bind(this));
  }

  async setRotationSpeed(value: CharacteristicValue) {
    this.FanState.RotationSpeed = value as number;

  }

  async getRotationSpeed(): Promise<CharacteristicValue> {  // get speed as percentage
    const rotationPercent = Math.round((this.FanState.RotationSpeed / this.MAXFANSPEED) * 100);
    // if (rotationPercent === 0) {
    //   rotationPercent = 1;
    // }
    this.platform.log.debug(`Get Characteristic RotationSpeed -> ${rotationPercent}%`);
    return rotationPercent;
  }

}
