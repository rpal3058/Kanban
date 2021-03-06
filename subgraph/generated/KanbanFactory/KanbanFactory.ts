// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class kanbanCreated extends ethereum.Event {
  get params(): kanbanCreated__Params {
    return new kanbanCreated__Params(this);
  }
}

export class kanbanCreated__Params {
  _event: kanbanCreated;

  constructor(event: kanbanCreated) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get creator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get instance(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get pm(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get title(): string {
    return this._event.parameters[4].value.toString();
  }

  get description(): string {
    return this._event.parameters[5].value.toString();
  }
}

export class KanbanFactory__kanbanInfoResult {
  value0: Address;
  value1: string;
  value2: string;

  constructor(value0: Address, value1: string, value2: string) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromString(this.value1));
    map.set("value2", ethereum.Value.fromString(this.value2));
    return map;
  }
}

export class KanbanFactory extends ethereum.SmartContract {
  static bind(address: Address): KanbanFactory {
    return new KanbanFactory("KanbanFactory", address);
  }

  kanbanInfo(param0: BigInt): KanbanFactory__kanbanInfoResult {
    let result = super.call(
      "kanbanInfo",
      "kanbanInfo(uint256):(address,string,string)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new KanbanFactory__kanbanInfoResult(
      result[0].toAddress(),
      result[1].toString(),
      result[2].toString()
    );
  }

  try_kanbanInfo(
    param0: BigInt
  ): ethereum.CallResult<KanbanFactory__kanbanInfoResult> {
    let result = super.tryCall(
      "kanbanInfo",
      "kanbanInfo(uint256):(address,string,string)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new KanbanFactory__kanbanInfoResult(
        value[0].toAddress(),
        value[1].toString(),
        value[2].toString()
      )
    );
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _baseKanbanAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreateKanbanCall extends ethereum.Call {
  get inputs(): CreateKanbanCall__Inputs {
    return new CreateKanbanCall__Inputs(this);
  }

  get outputs(): CreateKanbanCall__Outputs {
    return new CreateKanbanCall__Outputs(this);
  }
}

export class CreateKanbanCall__Inputs {
  _call: CreateKanbanCall;

  constructor(call: CreateKanbanCall) {
    this._call = call;
  }

  get _title(): string {
    return this._call.inputValues[0].value.toString();
  }

  get _description(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _pm(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class CreateKanbanCall__Outputs {
  _call: CreateKanbanCall;

  constructor(call: CreateKanbanCall) {
    this._call = call;
  }
}
