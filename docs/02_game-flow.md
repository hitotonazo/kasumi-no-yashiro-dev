> **実装開始前の必須確認**
> `00_project.md` → `01_pages.md` → `02_game-flow.md` → `03_truth-ending-images.md` の順ですべて確認してください。
> **1ファイルだけを読んで実装を開始しないでください。**
> 仕様書にないページ分割・統合・タブ化・重要文言追加・PHASE条件変更は行わず、必要な変更が仕様外に及ぶ場合は実装前に理由と影響範囲を報告してください。

# 02_game-flow.md
# 花澄の杜 ARG｜ゲーム進行・状態管理仕様

## 1. 基本進行

```text
PHASE0
普通の介護施設サイト
↓
PHASE1
施設だよりの写真がMRI/CTへ変化
↓
record-fragment
置換率6％を発見
↓
PHASE2
認知症ケア年表が研究記録へ書き換わる
↓
record-longterm
人工神経組織・96％・100％予定・他対象者を発見
↓
PHASE3
生活支援制度の集合写真上に適合度表示
↓
support-selection
社会的に孤立した人々を研究対象として選別していたと判明
↓
truth
人工神経置換研究 最終報告書
```

分岐を作らない。

## 2. state

論理state：

```js
{
  version: 1,
  phase: 0,
  discovered: {
    phase1: false,
    phase2: false,
    phase3: false
  },
  unlocked: {
    fragment: false,
    longterm: false,
    selection: false,
    truth: false
  }
}
```

modulesにstate機能がある場合は意味を維持してマッピングする。

## 3. PHASE0

初期状態。

- `index.html`
- `news-keiroukai.html`
- `care.html`
- `support.html`

は通常ページとして閲覧できる。

以下は未解放：
- `record-fragment.html`
- `record-longterm.html`
- `support-selection.html`
- `truth.html`

## 4. PHASE1

### 発生ページ
`news-keiroukai.html`

### 重要異常
`news-keiroukai-normal.jpg` が一時的に `yoshie-mri-ct.jpg` へ切り替わる。

### タイミング
初回表示時：

```text
ページロード
↓ 3.5秒
軽いノイズ 250ms
↓
MRI/CT表示 2.5秒
↓
軽いノイズ 250ms
↓
通常写真へ戻る
↓ 4.5秒
再び同じサイクル
```

- MRI表示中のみ `cursor:pointer`
- 通常写真中はクリックしても進行しない
- 画像切替はcrossfade＋短いノイズ。強いフラッシュ禁止

### 初回MRIクリック
1. 二重クリックをロック
2. `discovered.phase1 = true`
3. `unlocked.fragment = true`
4. `phase = 1`
5. state保存
6. `modules` の「サイトが改変されました」を1回再生
7. 演出完了後 `record-fragment.html`

### 再訪
PHASE1発見済みでも画像異常は残してよい。
ただしクリック時にサイト改変演出を再生しない。
そのまま `record-fragment.html` へ遷移。

## 5. record-fragment終了

`TOPへ戻る` → `index.html`

ここでPHASE1状態は維持する。

## 6. PHASE2

### 発生条件
`discovered.phase1 === true`

### 発生ページ
`care.html`

### 重要異常
通常年表が研究年表へ書き換わる。

### 発火
年表セクションがviewportに入ったら開始。
初回のみアニメーションする。

各行を **600ms間隔** で順番に差し替える。

順序：

```text
2009 通常 → 初回処置実施／置換率6％
2012 通常 → 置換範囲拡大／長期記憶正常
2016 通常 → 置換率43％／人格変化認められず
2019 通常 → 複数領域同時置換開始
2022 通常 → 置換率79％／自己認識正常
2025 通常 → 黒マーカー
```

2025の黒マーカーは最後に出現。

### hotspot
2025の黒塗り部分。

- `role="button"`
- keyboard Enter/Spaceでも操作可
- hover/focusでごく弱いノイズまたは1〜2px揺れ
- 「クリックしてください」等の直接説明は出さない

### 初回クリック
1. ロック
2. `discovered.phase2 = true`
3. `unlocked.longterm = true`
4. `phase = 2`
5. 保存
6. modulesのサイト改変演出を1回
7. `record-longterm.html`

### 再訪
PHASE2発見済み：
- 研究年表を最初から表示
- 再度の書き換えアニメーションは不要
- 黒マーカークリックで即 `record-longterm.html`
- 改変演出は再生しない

## 7. record-longterm補助操作

### 人工神経組織
`artificial-neural-tissue.jpg` をクリックすると：

初期：
`試料記録`

クリック後：
```text
人工神経組織
白石芳江の神経活動をもとに生成
```

- state上のPHASEは変更しない
- サイト改変演出を再生しない
- 同ページ内の理解補助のみ

### 長期観察対象者
`subjects-group-masked.jpg` は説明せず提示。
ページ下部は `TOPへ戻る` のみ。

## 8. PHASE3

### 発生条件
`discovered.phase2 === true`

### 発生ページ
`support.html`

### ページレイアウト条件
集合写真 `support-normal-group.jpg` をページ上部〜中盤に置き、一般的な閲覧で8秒以内に到達できる位置にする。

### 重要異常
集合写真上に「適合度○％」のポップアップが順次出現。

**画像自体は差し替えない。**

### タイミング

ページロードを起点：

```text
0秒       通常
8秒       1つ目表示
10.5秒    2つ目
13秒      3つ目
15.5秒    4つ目
18秒      5つ目
20.5秒    6つ目
```

表示後のポップアップは消さず蓄積する。

値の例：
```text
82％
94％ / 対象候補
37％
88％
61％
92％ / 対象候補
```

- ポップアップはHTML/CSS
- 画像上の人物位置に `%` ベースのabsolute配置
- PC/SPで顔位置に合わせて個別調整
- 数字が顔を完全に隠さない
- 色は黒〜濃グレー、数値は白または淡赤
- 金額表示のような目立ち方は参考にしてよいが、金額にはしない

### hotspot解放
最初のポップアップが出現した時点で集合写真全体をクリック可能にする。

### 初回クリック
1. ロック
2. `discovered.phase3 = true`
3. `unlocked.selection = true`
4. `phase = 3`
5. 保存
6. modulesのサイト改変演出を1回
7. `support-selection.html`

### 再訪
PHASE3発見済み：
- 適合度はページ表示時点から表示してよい
- 画像クリックで即selectionへ
- サイト改変演出は再生しない

## 9. 真相解放

`support-selection.html` の最後の
`最終研究報告書`
ボタンをクリック。

```js
state.unlocked.truth = true;
saveState();
location.href = 'truth.html';
```

新しいPHASE番号をストーリー上は追加しない。

debug上のみ「Truth」をPHASE4相当として扱ってよい。

## 10. 直接URL

### 常時閲覧可
- `index.html`
- `news-keiroukai.html`
- `care.html`
- `support.html`

### ガード対象
- `record-fragment.html` → fragment未解放ならTOP
- `record-longterm.html` → longterm未解放ならTOP
- `support-selection.html` → selection未解放ならTOP
- `truth.html` → truth未解放ならTOP

リダイレクト時にstateを進めない。
URLを知っているだけで真相へ先回りできないこと。

## 11. reload / Back / Forward

必須：

- reload後もPHASE維持
- Back後も発見済み状態維持
- Forward後も同様
- 既発見の改変演出は再発しない
- タイマーが二重登録されない
- `pageshow`（bfcache）復帰でも二重初期化しない

各ページ初期化はidempotentにする。

## 12. サイト改変演出

既存 `modules` の実装のみ使用。

再生条件：
- PHASE1初回発見
- PHASE2初回発見
- PHASE3初回発見

再生しない：
- 同一異常の再クリック
- record-longterm内の人工神経組織クリック
- 真相ページ内操作
- reloadのみ
- Back/Forwardのみ

演出再生中は二重クリックを防止。

## 13. Reset

Headerの探索リセット。

確認：
`探索状況をリセットしますか？`

確定：
- `hanasumi_arg_state_v1` を初期化
- modules reset APIがあれば実行
- `index.html` へ
- PHASE0状態に完全復帰

リセット後確認：
- MRIクリック前
- care年表通常
- support適合度なし
- 内部資料直URL不可
- truth直URL不可

## 14. Debug

既存modulesのdebug UIを使用。

debug設定時の状態：

| Debug | phase | discovered | unlocked |
|---|---:|---|---|
| PHASE0 | 0 | 全false | 全false |
| PHASE1 | 1 | 1=true | fragment |
| PHASE2 | 2 | 1,2=true | fragment,longterm |
| PHASE3 | 3 | 1,2,3=true | fragment,longterm,selection |
| Truth | 3 | 1,2,3=true | fragment,longterm,selection,truth |

矛盾する部分状態を作らない。

## 15. 重要なQA

- PHASE0でcare年表が研究内容になっていない
- PHASE0でsupport適合度が出ない
- PHASE1のMRI表示が誰でも異常と判断できる
- PHASE1発見済みでも演出は1回のみ
- PHASE2の黒マーカー以外に重要hotspotを増やさない
- PHASE3で画像差し替えをしない
- PHASE3の最初の表示は約8秒
- 真相直URLを防ぐ
- resetが完全
- debugが本番に露出しない
