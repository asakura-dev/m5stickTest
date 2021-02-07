// Reference
// RoverC Spec: https://docs.m5stack.com/#/en/hat/hat-roverc
// sample code: https://github.com/m5stack/M5-ProductExampleCodes/tree/master/Application/RoverC_Arduino_Alone
// pins/i2c: https://github.com/Moddable-OpenSource/moddable/blob/public/documentation/io/io.md#i2c

import { I2C } from 'pins/i2c'

declare const trace: any

const ROVER_ADDRESS = 0x38

class Rover {
  i2c: I2C
  constructor() {
    this.i2c = new I2C({
      sda: 0,
      scl: 26,
      hz: 100,
      address: ROVER_ADDRESS,
    })
  }
  /**
   * 
   * @param direction １: forward, 2: back
   * @param ratio -1~1の範囲
   */
  move(direction: number, ratio: number){
    let baseSpeed = 0
    let speed = 0;
    if(direction === 1){
      baseSpeed = 100
    } 
    if(direction === 2){
      baseSpeed = -20
      speed = -40
    }
    let leftSpeed = baseSpeed * ratio
    let rightSpeed = baseSpeed * (1 - ratio)
    trace(`leftSpeed: ${leftSpeed}, rightSpeed: ${rightSpeed}\n`);
    this.sendIic(0x00, rightSpeed)
    this.sendIic(0x01, leftSpeed)
    this.sendIic(0x02, rightSpeed)
    this.sendIic(0x03, leftSpeed)
  }
  moveForward(speed: number): void {
    this.sendIic(0x00, speed)
    this.sendIic(0x01, speed)
    this.sendIic(0x02, speed)
    this.sendIic(0x03, speed)
  }
  moveBack(speed: number): void {
    this.moveForward(-1 * speed)
  }
  moveTurnLeft(speed: number): void {
    this.sendIic(0x00, speed)
    this.sendIic(0x01, -1 * speed)
    this.sendIic(0x02, speed)
    this.sendIic(0x03, -1 * speed)
  }
  moveTurnRight(speed: number): void {
    this.moveTurnLeft(-1 * speed)
  }
  moveLeft(speed: number): void {
    this.sendIic(0x00, -1 * speed)
    this.sendIic(0x01, speed)
    this.sendIic(0x02, speed)
    this.sendIic(0x03, -1 * speed)
  }
  moveRight(speed: number): void {
    this.moveLeft(-1 * speed)
  }
  moveStop(): void {
    this.sendIic(0x00, 0)
    this.sendIic(0x01, 0)
    this.sendIic(0x02, 0)
    this.sendIic(0x03, 0)
  }
  private sendIic(register: number, speed: number): void {
    this.i2c.write(register, speed)
  }
}

export { Rover }
