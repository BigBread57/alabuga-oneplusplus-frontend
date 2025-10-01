// Цвета для сущностей
import {
  Blue,
  DarkPurple,
  DeepDarkPurple,
  LightBlue,
  Orange,
  Purple,
} from '@/libs/AntdThemes'

export const ENTITY_COLORS = {
  rank: DeepDarkPurple,
  missionBranch: DarkPurple,
  mission: Blue,
  artefact: LightBlue,
  competency: Purple,
  event: Orange,
} as const
