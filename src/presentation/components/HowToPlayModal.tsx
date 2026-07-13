import { Button, Modal } from "antd";
import styles from "./HowToPlayModal.module.css";

type HowToPlayModalProps = {
  open: boolean;
  onClose: () => void;
};

export function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Como jogar"
      rootClassName={styles.bottomSheetRoot}
      closable={{ "aria-label": "Fechar" }}
      footer={[
        <Button key="ok" type="primary" block onClick={onClose}>
          Entendi
        </Button>,
      ]}
    >
      <ol className={styles.steps}>
        <li>Memorize a sequência de botões que vai acender no tabuleiro.</li>
        <li>Quando a exibição terminar, toque nos botões certos — a ordem não importa.</li>
        <li>Toque em Enviar assim que selecionar todos os botões da sequência.</li>
        <li>Cuidado: tocar em um botão errado encerra a partida na hora.</li>
        <li>A cada rodada concluída, a sequência fica um pouco maior.</li>
      </ol>
    </Modal>
  );
}
