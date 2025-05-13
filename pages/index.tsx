import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import '@/styles/globals.css';

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
  // 카드가 충분하지 않으면 가능한 만큼만 반환
  if (list.length <= count) return [...list];
  
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function Player({ 
  playerIndex, 
  gongHand, 
  suHand, 
  selectedGong, 
  selectedSu, 
  setSelectedGong, 
  setSelectedSu 
}: PlayerProps) {
  // 카드 선택 토글 함수 추가
  const toggleGongSelection = (gong: CharacterCard) => {
    if (selectedGong && selectedGong.id === gong.id) {
      setSelectedGong(null);
    } else {
      setSelectedGong(gong);
    }
  };

  const toggleSuSelection = (su: CharacterCard) => {
    if (selectedSu && selectedSu.id === su.id) {
      setSelectedSu(null);
    } else {
      setSelectedSu(su);
    }
  };

  return (
    <div className="mb-10 w-full">
      <h2 className="text-2xl font-bold mb-2 text-center">플레이어 {playerIndex + 1}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold text-pink-600 mb-2">공 카드</h3>
          <div className="card-container">
  {gongHand.map((g) => (
    <Card
      key={g.id}
      className={`card-hover ${selectedGong?.id === g.id ? 'card-highlight-pink' : ''}`}
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
          <h3 className="text-xl font-semibold text-blue-600 mb-2">수 카드</h3>
          <div className="card-container">
            {suHand.map((s) => (
              <Card
                key={s.id}
               className={`card-hover ${selectedSu?.id === s.id ? 'card-highlight-blue' : ''}`}
              onClick={() => toggleSuSelection(s)}
              >
              <CardContent className="p-4">
                <h4 className="card-name">{s.name}</h4>
                <p className="card-trait">{s.trait}</p>
              </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {selectedGong && selectedSu && (
  <div className="result-card mx-auto max-w-md my-6">
    <h2 className="text-xl font-semibold mb-2 text-pink-600">공: {selectedGong.name}</h2>
    <p className="mb-4 text-gray-700">{selectedGong.trait}</p>
    <h2 className="text-xl font-semibold mb-2 text-blue-600">수: {selectedSu.name}</h2>
    <p className="text-gray-700">{selectedSu.trait}</p>
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
  const [remainingGongs, setRemainingGongs] = useState<CharacterCard[]>([...defaultGongs]);
  const [remainingSus, setRemainingSus] = useState<CharacterCard[]>([...defaultSus]);

  const addPlayer = () => {
    // 남은 카드가 충분한지 확인
    if (remainingGongs.length < 2 || remainingSus.length < 2) {
      alert("남은 카드가 부족합니다!");
      return;
    }

    // 플레이어 카드 뽑기
    const newGongHand = drawCards(remainingGongs, 2);
    const newSuHand = drawCards(remainingSus, 2);

    // 남은 카드 업데이트
    setRemainingGongs(remainingGongs.filter(g => !newGongHand.some(card => card.id === g.id)));
    setRemainingSus(remainingSus.filter(s => !newSuHand.some(card => card.id === s.id)));

    // 새 플레이어 추가
    setPlayers([
      ...players,
      {
        gongHand: newGongHand,
        suHand: newSuHand,
        selectedGong: null,
        selectedSu: null,
      },
    ]);
  };

  const updatePlayer = (index: number, updated: Partial<PlayerState>) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { ...updatedPlayers[index], ...updated };
    setPlayers(updatedPlayers);
  };

  // 게임 리셋 기능 추가
  const resetGame = () => {
    setPlayers([]);
    setRemainingGongs([...defaultGongs]);
    setRemainingSus([...defaultSus]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        저런 공에는 이런 수가 딱이야! 💕
      </h1>

      <div className="flex gap-4 mb-6">
        <Button onClick={addPlayer} className="text-lg" disabled={remainingGongs.length < 2 || remainingSus.length < 2}>
          플레이어 추가 ➕
        </Button>
        <Button onClick={resetGame} className="text-lg bg-red-500 hover:bg-red-600">
          게임 리셋 🔄
        </Button>
      </div>

      {/* 남은 카드 정보 표시 */}
      <div className="mb-6 text-center">
        <p>남은 카드: 공 {remainingGongs.length}장, 수 {remainingSus.length}장</p>
      </div>

      <div className="w-full max-w-6xl">
        {players.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            플레이어를 추가해서 게임을 시작하세요!
          </div>
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