// JSON模块类型定义

interface PositionMapping {
  [key: string]: string;
}

interface RealmMapping {
  [key: string]: string;
}

interface Disciple {
  id: number;
  name: string;
  realmLevel: number;
  cultivation: number;
  status: string;
  realmName?: string;
}

interface LeaderInfo {
  name: string;
  title: string;
  realmLevel: number;
  cultivationValue: number;
  cultivationLimit: number;
  position: number;
  joinDate: string;
  skills: string[];
  discipleCount: number;
  sectLevel: number;
  sectReputation: number;
  disciples: Disciple[];
  resources: {
    spiritStone: number;
    herbs: number;
    magicWeapons: number;
    treasures: number;
  };
  positionName?: string;
  realmName?: string;
}

declare module 'src/data/positionMapping.json' {
  const value: PositionMapping;
  export default value;
}

declare module 'src/data/realmMapping.json' {
  const value: RealmMapping;
  export default value;
}

declare module 'src/data/cultivationStages.json' {
  const value: Array<{
    stageDivision: string;
    majorRealm: string;
    minorRealm: string;
    stage: string;
    minValue: number;
    maxValue: number;
  }>;
  export default value;
}