export interface CommonData{
  name: string,
  date: Date,
  place: string,
  interval: number,
  temperature: number,
  positionHead: string,
  nameHead: string,
  positionChairman: string,
  nameChairman: string,
  nameMember1: string,
  nameMember2: string,
  nameMember3: string,
  pipeLine: PipeLine[],
  instruments: Instruments[]
};

export interface PipeLine{
  numberPipeLine: number,
  namePipeLine: string,
  nameBorder: string
}

export interface Instruments{
  name: string,
  certificate: string
}
