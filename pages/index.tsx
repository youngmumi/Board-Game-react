import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import "./Home.css";

type CharacterCard = {
  id: string;
  name: string;
  trait: string;
};

type PlayerProps = {
  playerIndex: number;
  gongHand: CharacterCard[];
  suHand: CharacterCard[];
  selectedGong: CharacterCard | null;
  selectedSu: CharacterCard | null;
  setSelectedGong: (card: CharacterCard | null) => void;
  setSelectedSu: (card: CharacterCard | null) => void;
};

const defaultGongs: CharacterCard[] = [
  { id: "g1", name: "차도남 검사", trait: "항상 차가운 눈빛을 가진 천재" },
  { id: "g2", name: "초딩같은 연예인", trait: "까불까불하지만 집착 강함" },
  { id: "g3", name: "불량 고등학생", trait: "말은 거칠지만 손은 따뜻함" },
  { id: "g4", name: "능글맞은 재벌 3세", trait: "돈과 재치가 넘치는 능구렁이" },
  { id: "g5", name: "엄격한 의사", trait: "환자에겐 차갑지만 진심은 따뜻함" },
  { id: "g6", name: "무뚝뚝한 형사", trait: "말보다는 행동으로 보여주는 타입" },
];

const defaultSus: CharacterCard[] = [
  { id: "s1", name: "츤데레 대학생", trait: "겉은 새침하지만 속은 여려움" },
  { id: "s2", name: "괴팍한 천재 요리사", trait: "칼보다 입이 더 빠름" },
  { id: "s3", name: "조용한 웹툰 작가", trait: "대사 한 마디에 모든 감정을 담는다" },
  { id: "s4", name: "엉뚱한 비서", trait: "실수투성이지만 위기에 강함" },
  { id: "s5", name: "야무진 고등학생", trait: "어른보다 더 어른스러운 철두철미함" },
  { id: "s6", name: "당찬 사업가", trait: "야망 넘치고 솔직한 성격의 소유자" },
];

function drawCards<T>(list: T[], count: number): T[] {
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function Player({
  playerIndex,
  gongHand,
  suHand,
  selectedGong,
  selectedSu,
  setSelectedGong,
  setSelectedSu,
}: PlayerProps) {
  const toggleGongSelection = (card: CharacterCard) => {
    if (selectedGong) return; // 이미 선택 시 변경 불가
    setSelectedGong(card);
  };

  const toggleSuSelection = (card: CharacterCard) => {
    if (selectedSu) return;
    setSelectedSu(card);
  };

  return (
    <div className="player-container">
      <h2 className="player-title">플레이어 {playerIndex + 1}</h2>
      <div className="card-section">
        <div>
          <h3 className="card-heading gong">공 카드</h3>
          <div className="card-container">
            {gongHand.map((g) => (
              <Card
                key={g.id}
                className={`card-hover ${selectedGong?.id === g.id ? "highlight-gong" : ""}`}
                onClick={() => toggleGongSelection(g)}
              >
                <CardContent>
                  <h4 className="card-name">{g.name}</h4>
                  <p className="card-trait">{g.trait}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="card-heading su">수 카드</h3>
          <div className="card-container">
            {suHand.map((s) => (
              <Card
                key={s.id}
                className={`card-hover ${selectedSu?.id === s.id ? "highlight-su" : ""}`}
                onClick={() => toggleSuSelection(s)}
              >
                <CardContent>
                  <h4 className="card-name">{s.name}</h4>
                  <p className="card-trait">{s.trait}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedGong && selectedSu && (
        <div className="result-card">
          <h2 className="result-title gong">공: {selectedGong.name}</h2>
          <p className="result-trait">{selectedGong.trait}</p>
          <h2 className="result-title su">수: {selectedSu.name}</h2>
          <p className="result-trait">{selectedSu.trait}</p>
        </div>
      )}
    </div>
  );
}

type PlayerState = {
  gongHand: CharacterCard[];
  suHand: CharacterCard[];
  selectedGong: CharacterCard | null;
  selectedSu: CharacterCard | null;
};

export default function Home() {
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [remainingGongs, setRemainingGongs] = useState([...defaultGongs]);
  const [remainingSus, setRemainingSus] = useState([...defaultSus]);

  const addPlayer = useCallback(() => {
    if (remainingGongs.length < 2 || remainingSus.length < 2) {
      alert("남은 카드가 부족합니다!");
      return;
    }

    const newGongHand = drawCards(remainingGongs, 2);
    const newSuHand = drawCards(remainingSus, 2);

    setRemainingGongs((prev) => prev.filter((g) => !newGongHand.find((ng) => ng.id === g.id)));
    setRemainingSus((prev) => prev.filter((s) => !newSuHand.find((ns) => ns.id === s.id)));

    setPlayers((prev) => [
      ...prev,
      {
        gongHand: newGongHand,
        suHand: newSuHand,
        selectedGong: null,
        selectedSu: null,
      },
    ]);
  }, [remainingGongs, remainingSus]);

  const updatePlayer = (index: number, updated: Partial<PlayerState>) => {
    setPlayers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  const resetGame = () => {
    setPlayers([]);
    setRemainingGongs([...defaultGongs]);
    setRemainingSus([...defaultSus]);
  };

  return (
    <div className="main-container">
      <h1 className="main-title">저런 공에는 이런 수가 딱이야! 💕</h1>

      <div className="button-group">
        <Button onClick={addPlayer} disabled={remainingGongs.length < 2 || remainingSus.length < 2}>
          플레이어 추가 ➕
        </Button>
        <Button onClick={resetGame} className="reset-button">
          게임 리셋 🔄
        </Button>
      </div>

      <div className="card-count">
        남은 카드: 공 {remainingGongs.length}장, 수 {remainingSus.length}장
      </div>

      <div className="players-area">
        {players.length === 0 ? (
          <div className="no-player-msg">플레이어를 추가해서 게임을 시작하세요!</div>
        ) : (
          players.map((player, index) => (
            <Player
              key={index}
              playerIndex={index}
              gongHand={player.gongHand}
              suHand={player.suHand}
              selectedGong={player.selectedGong}
              selectedSu={player.selectedSu}
              setSelectedGong={(g) => updatePlayer(index, { selectedGong: g })}
              setSelectedSu={(s) => updatePlayer(index, { selectedSu: s })}
            />
          ))
        )}
      </div>
    </div>
  );
}
