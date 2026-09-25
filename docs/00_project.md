> **実装開始前の必須確認**
> `00_project.md` → `01_pages.md` → `02_game-flow.md` → `03_truth-ending-images.md` の順ですべて確認してください。
> **1ファイルだけを読んで実装を開始しないでください。**
> 仕様書にないページ分割・統合・タブ化・重要文言追加・PHASE条件変更は行わず、必要な変更が仕様外に及ぶ場合は実装前に理由と影響範囲を報告してください。

# 00_project.md
# 花澄の杜 ARG｜プロジェクト共通仕様

## 1. 作品概要

- 作品名：介護付有料老人ホーム「花澄の杜」
- 形式：異常発見型Web ARG
- 想定プレイ時間：20〜60分
- 進行：一本道
- 構成：通常サイト → PHASE1 → PHASE2 → PHASE3 → 真相
- Ending：**なし**。`truth.html` の最終研究報告書とX共有ボタンで完結する。
- 最初に見えるサイトは、現実に存在しそうな普通の介護施設サイトとして成立させる。
- 各PHASEで新しく出現する重要異常は1箇所のみ。過去に発見した異常は残してよい。
- 弱いノイズ、色味変化、文字の微細変化は補助演出として使用可。ただし重要異常より目立たせない。

### ストーリーの核
白石芳江を認知症から救う目的で始まった人工神経組織への置換研究が、徐々に「脳をどこまで人工物へ置き換えても本人なのか」という研究へ変質する。危険な処置を芳江本人で試さないため、花澄の杜は生活支援制度で身寄りのない高齢者・生活困窮者などを受け入れ、研究対象として選別・実験した。最終的に芳江は人工神経組織置換率100％、生体神経組織残存率0％となるが、記憶・人格・自己認識を維持している。

## 2. ページ一覧

| ファイル | 役割 | PHASE |
|---|---|---|
| `index.html` | 通常TOP、施設紹介、主要導線 | PHASE0〜 |
| `news-keiroukai.html` | 敬老会の施設だより、最初の異常 | PHASE1 |
| `record-fragment.html` | 断片的な研究資料 | PHASE1後 |
| `care.html` | 認知症ケア、年表の改変 | PHASE2 |
| `record-longterm.html` | 長期経過観察記録 | PHASE2後 |
| `support.html` | 生活支援制度、適合度ポップアップ | PHASE3 |
| `support-selection.html` | 生活支援制度 利用者選定記録 | PHASE3後 |
| `truth.html` | 人工神経置換研究 最終報告書 | 真相 |

`about.html`、`services.html` は作成しない。

## 3. デザイン方針

### 通常サイト
参考画像 `sankouPC.png` / `sankouSP.png` を視覚的な方向性として使用する。

- 全体：やわらかい、安心感、丸み、清潔感
- 介護・福祉サイトとして自然な見た目を最優先
- 丸角カード、淡い背景色、十分な余白
- 装飾はCSSの円・ドット・淡色ブロブで実装し、`symbol-dots-soft.png` は使用しない
- レイアウトを崩してまで装飾を優先しない
- 過度なアニメーションやホラー表現を通常サイトに持ち込まない

### 内部資料
`record-fragment.html`、`record-longterm.html`、`support-selection.html` は通常サイトより無機質にする。

- 背景：オフホワイト〜薄いグレー
- 細い罫線、記録番号風ラベル、表・カードを使用
- 角丸は通常サイトより小さくする
- 日本語で理解できることを最優先
- 「格好良いシステム画面」にしすぎない

### 真相
`truth.html` は通常サイトとのギャップを明確にする。

- 黒〜濃紺系の暗色背景
- CSSのみで微細ノイズを付与する（背景画像は使わない）
- 主要セクション間に1px程度の区切り線
- 暗色背景でも本文の可読性を優先
- 不気味さは「内容を理解した結果として怖い」方向にする
- 点滅、強い赤フラッシュ、読めない文字化け等は使用しない

## 4. カラー

以下を基準色とし、CodeXが勝手に別テーマへ変更しない。

```scss
$color-text: #3f403d;
$color-text-light: #6f716c;
$color-bg: #fffdf9;
$color-bg-soft: #f8f5ef;
$color-border: #e8e2d8;

$color-green: #78a85f;
$color-green-dark: #557c45;
$color-pink: #efb3ba;
$color-peach: #ee9d6d;
$color-yellow: #efd274;
$color-blue: #9bcfdf;

$truth-bg: #111417;
$truth-bg-soft: #171c20;
$truth-text: #e9eceb;
$truth-muted: #9ea8a4;
$truth-line: rgba(255,255,255,.12);
```

- Primary CTA：`$color-green-dark`
- Secondary CTA：白背景＋緑枠
- 通常サイトのアクセント：ピンク、ピーチ、黄、水色を少量
- 真相ページで通常サイトのパステルカラーを多用しない

## 5. フォント

- 見出し：`Zen Maru Gothic`
- 本文：`Noto Sans JP`
- 英語補助ラベル：`Nunito`
- 重要ストーリー情報は必ず日本語で表示
- 本文：PC 16px、SP 15pxを基準
- 最小文字サイズ：14px
- 本文 line-height：1.9前後
- 見出しは極端に巨大化しない

Google Fonts等で読み込む場合は、上記3書体以外を独自追加しない。

## 6. 共通幅・余白

```text
通常コンテナ: max-width 1200px
読み物コンテナ: max-width 860px
PC左右余白: 40px
SP左右余白: 20px

section-lg:
  PC 120px
  SP 72px

section-md:
  PC 96px
  SP 64px

section-sm:
  PC 64px
  SP 48px
```

- 共通 `.l-container` / `.l-container--narrow` を使用
- ページごとに独自max-widthを乱立させない
- 全幅演出・Heroのみ100%幅可
- SPで余白だけの画面が長く続かないこと

## 7. レスポンシブ

- PC基準：1280〜1440pxで破綻しない
- 最大コンテンツ幅：1200px
- SP基準：375〜430px
- ブレークポイント：`767px`
- 横スクロール禁止
- 画像は `width:100%; height:auto;`
- Heroやカード画像で `object-fit: cover` を使う場合、顔や重要要素が切れないよう `object-position` をページごとに調整
- タップ領域は最低44px
- SPでHeaderの探索リセットをハンバーガー内へ格納しない

## 8. Header

### PC
- 高さ目安：88px
- 左：`logo-hanasumi.png`。クリックで `index.html`
- ナビ：
  - 花澄の杜について → `index.html#concept`
  - 暮らし・サポート → `index.html#features`
  - 認知症ケア → `care.html`
  - 施設だより → `news-keiroukai.html`
  - 生活支援制度 → `support.html`
- 右端：探索リセット
- 必要に応じてお問い合わせCTA → `index.html#contact`

### SP
- 高さ目安：64px
- 左：ロゴ
- 右：探索リセット + ハンバーガー
- 探索リセットはハンバーガー内に入れない
- ハンバーガー内は上記ナビのみ
- メニュー開閉時にbodyスクロールを固定

## 9. Footer

- ロゴ：`logo-hanasumi.png`、クリックでTOP
- 通常ナビ
- コピーライト：
  `©ぺいぽぴー`
- フィクション表記：
  `※このWebサイトの内容はフィクションであり、実在の人物・団体とは一切関係ありません。`
- 真相ページでも同じ文言を必ず掲載

## 10. ボタン

共通 `.c-button` を基準にし、ページ固有で一から再定義しない。

### Primary
- 高さ：52px（SP 48px）
- 左右padding：28px
- border-radius：999px
- 背景：`$color-green-dark`
- 文字：白
- hover：明度変化＋矢印を2〜4px移動程度

### Secondary
- 白背景
- 緑1px枠
- 緑文字

### Text link
- 下線または矢印
- 主要CTAと混同しない

研究・真相ページでは配色変更可。ただしサイズ・角丸・文字サイズは共通ルールを維持する。

## 11. TOP Heroスライドショー

- 4枚使用
  - `hero-top-01.jpg`
  - `hero-top-02.jpg`
  - `hero-top-03.jpg`
  - `hero-top-04.jpg`
- 自動切替：5.5秒
- フェード：700ms
- 矢印またはドットナビを付ける
- ホバー中停止は不要
- `prefers-reduced-motion: reduce` では自動切替を止め、手動切替のみ
- 画像上に過度な暗幕をかけない
- キャッチコピー：
  `その人らしい毎日を、いつまでも。`

## 12. SCSS構造

SCSSを正とし、生成CSSを直接編集しない。

```text
assets/
  scss/
    style.scss
    foundation/
      _variables.scss
      _mixins.scss
      _reset.scss
      _base.scss
    layout/
      _container.scss
      _header.scss
      _footer.scss
    components/
      _button.scss
      _hero.scss
      _card.scss
      _timeline.scss
      _document.scss
      _glitch.scss
      _popup.scss
    pages/
      _home.scss
      _news.scss
      _care.scss
      _record.scss
      _support.scss
      _truth.scss
  css/
    style.css
```

`style.scss` を唯一のエントリーポイントとする。

`package.json` 例：

```json
{
  "scripts": {
    "dev": "sass --watch assets/scss/style.scss:assets/css/style.css",
    "build": "sass --style=compressed assets/scss/style.scss assets/css/style.css"
  }
}
```

- CodeXはSCSS変更後に必ずbuildまで実行する
- `style.css` のみHTMLから基本CSSとして読み込む
- SCSSだけ変更して作業完了にしない

## 13. JS構造

```text
assets/
  js/
    main.js       // slider, menu, common UI
    game.js       // state, guards, phase-specific behavior
```

- バンドル必須にはしない
- ページ判定は `body[data-page="..."]` で行う
- ページごとに同じstate処理を重複実装しない
- `modules` に存在する「サイト改変演出」「デバッグモード」は必ず流用
- 同等機能を新規実装し直さない

## 14. modules使用ルール

プロジェクト内の `modules` フォルダを最初に確認すること。

必須：
- 「サイトが改変されました」演出を既存modulesから使用
- デバッグモードを既存modulesから使用

禁止：
- modulesの類似機能を新規実装
- modules内部を無断改変
- 演出時間・フォント・表示方法を勝手に変更

作品固有の接続が必要な場合は、modules外のアダプター側で行う。modulesそのものの変更が必要なら実装前に報告する。

## 15. 論理state

modules側に既存state APIがある場合はそれにマッピングする。APIがない場合のみ、以下の論理stateを `localStorage` に保存する。

キー：
`hanasumi_arg_state_v1`

```js
{
  version: 1,
  phase: 0, // 0,1,2,3。debug上のみtruthを4相当として扱ってよい
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

- 再読み込み、ページ移動、Back/Forwardでも維持
- 発見済み異常を再度操作しても改変演出を再生しない
- stateが壊れている場合は安全側としてPHASE0へ正規化
- 本作品以外のlocalStorageを削除しない

## 16. Reset

- Headerの「探索リセット」を押す
- 確認文：`探索状況をリセットしますか？`
- キャンセル可
- 確定時：
  1. 本作品のstateを初期化
  2. modules側にreset APIがあれば実行
  3. `index.html` へ遷移
- PHASE0へ完全復帰すること

## 17. Debug

既存modulesのdebugを使用。

debugで最低限確認できる状態：
- PHASE0
- PHASE1発見済み
- PHASE2発見済み
- PHASE3発見済み
- 真相解放済み
- state内容
- reset

debug切替時は、それ以前のフラグを矛盾なく補完する。

例：
- PHASE2に設定 → PHASE1/2は発見済み、fragment/longterm解放
- 真相に設定 → PHASE1〜3発見済み、全内部資料とtruth解放

本番ではdebug UIを表示しない。

## 18. CodeX独自判断禁止

- `about.html` / `services.html` を作成しない
- 指定外のページを追加しない
- 内部資料をタブやモーダル連続へ変更しない
- 真相ページを複数ページへ分割しない
- PHASE数を増減しない
- ストーリー文言を要約・言い換えして意味を変えない
- 英語のシステム名を大量に追加しない
- 重要異常の場所を変更しない
- 画像を別素材へ勝手に差し替えない
- `symbol-dots-soft.png`、`truth-bg-noise-texture.jpg` を追加しない。装飾・ノイズはCSSで作る
- 「より良い」と判断して仕様外変更を行わない。必要なら提案だけ報告する

## 19. 実装後の段階確認

一括で全機能を作って完了扱いにしない。

1. 共通基盤・Header/Footer・コンテナ・フォント・余白・SP
2. 通常サイト完成
3. ARG前半・内部資料
4. 真相ページ
5. PHASE/state/modules/reset/debug統合

各段階でPC/SPを確認してから次へ進む。
