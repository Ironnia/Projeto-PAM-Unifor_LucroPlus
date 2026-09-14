/* Toast simples exibido sobre a tela. */
import { Icon } from './Icon';

export function Toast({ mensagem }: { mensagem: string }) {
  if (!mensagem) return null;
  return (
    <div className="toast">
      <Icon name="ph-info" size={17} />
      {mensagem}
    </div>
  );
}
