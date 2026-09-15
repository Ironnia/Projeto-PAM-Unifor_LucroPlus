/* ==========================================================================
   Icon — ponte entre os nomes de ícone do protótipo (ex.: "ph-house") e os
   componentes do @phosphor-icons/react. Permite usar ícones tanto de forma
   estática quanto vinda dos dados (ex.: previsao[i].icone).
   ========================================================================== */
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  ArrowsClockwise,
  Bell,
  Broadcast,
  CalendarBlank,
  CalendarCheck,
  Check,
  CheckCircle,
  CheckSquare,
  CircleNotch,
  Coins,
  EnvelopeSimple,
  Eye,
  EyeSlash,
  Fingerprint,
  FloppyDisk,
  ForkKnife,
  Gear,
  House,
  Info,
  Lightbulb,
  Lightning,
  LockSimple,
  Package,
  PlugsConnected,
  PuzzlePiece,
  ShieldCheck,
  ShoppingCart,
  Tag,
  TrendUp,
  Trophy,
  Warning,
  WarningOctagon,
  X,
} from '@phosphor-icons/react';

/** Mapa nome-do-protótipo → componente Phosphor. */
const MAP: Record<string, PhosphorIcon> = {
  'ph-archive': Archive,
  'ph-arrow-left': ArrowLeft,
  'ph-arrow-right': ArrowRight,
  'ph-arrows-clockwise': ArrowsClockwise,
  'ph-bell': Bell,
  'ph-broadcast': Broadcast,
  'ph-calendar-blank': CalendarBlank,
  'ph-calendar-check': CalendarCheck,
  'ph-check': Check,
  'ph-check-circle': CheckCircle,
  'ph-check-square': CheckSquare,
  'ph-circle-notch': CircleNotch,
  'ph-coins': Coins,
  'ph-envelope-simple': EnvelopeSimple,
  'ph-eye': Eye,
  'ph-eye-slash': EyeSlash,
  'ph-fingerprint': Fingerprint,
  'ph-floppy-disk': FloppyDisk,
  'ph-fork-knife': ForkKnife,
  'ph-gear': Gear,
  'ph-house': House,
  'ph-info': Info,
  'ph-lightbulb': Lightbulb,
  'ph-lightning': Lightning,
  'ph-lock-simple': LockSimple,
  'ph-package': Package,
  'ph-plugs-connected': PlugsConnected,
  'ph-puzzle-piece': PuzzlePiece,
  'ph-shield-check': ShieldCheck,
  'ph-shopping-cart': ShoppingCart,
  'ph-tag': Tag,
  'ph-trend-up': TrendUp,
  'ph-trophy': Trophy,
  'ph-warning': Warning,
  'ph-warning-octagon': WarningOctagon,
  'ph-x': X,
};

interface IconProps {
  /** Nome do ícone no formato do protótipo, ex.: "ph-house". */
  name: string;
  /** Tamanho em pixels (equivale ao font-size usado no CSS original). */
  size?: number;
  /** Cor; por padrão herda a cor do texto (currentColor), como no protótipo. */
  color?: string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  className?: string;
}

export function Icon({ name, size = 18, color = 'currentColor', weight = 'regular', className }: IconProps) {
  const Cmp = MAP[name];
  if (!Cmp) return null;
  return <Cmp size={size} color={color} weight={weight} className={className} />;
}
