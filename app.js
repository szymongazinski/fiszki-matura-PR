const vieteRaw = String.raw`#separator:tab
#html:true
Dwa rozwiązania tych samych znaków.	\[ x_1 \cdot x_2 &gt; 0\]
Dwa rozwiązania dodatnie.	\[x_1 \cdot x_2 &gt; 0 \land x_1 + x_2 &gt; 0\]
Dwa rozwiązania ujemne.	\[x_1 \cdot x_2 &gt; 0 \land x_1 + x_2 &lt; 0 \]
Dwa rozwiązania różnych znaków.	\[ x_1 \cdot x_2 &lt; 0\]
\[ (x_1 - x_2)^2 &gt; 0 \]	\[ (x_1 + x_2)^2 - 4x_1 x_2 &gt; 0 \]
\[ \frac{1}{x_1} + \frac{1}{x_2} = 0, \quad x_1 \neq 0 \land x_2 \neq 0 \]	\[ x_1 + x_2 = 0\]<br>To jest równoważne, ponieważ mamy równanie! Można przemnożyć przez \[x_1 x_2 \]
\[\frac{1}{x_1} + \frac{1}{x_2} &gt; 0, \quad x_1 \neq 0 \land x_2 \neq 0 \]	\[\frac{x_1 + x_2}{x_1 x_2} &gt; 0 \]<br>Tutaj już trzeba sprowadzać do wspólnego mianownika, nie wiemy czy rozwiązania są dodatnie czy nie!
\[x_1^2 + x_2^2 = 0\]	\[(x_1 + x_2)^2 - 2x_1x_2 = 0\]
\[x_1^3 + x_2^3 =0\]	\[(x_1 + x_2)((x_1 + x_2)^2 - 3x_1 x_2) =0\]
\[x_1^3 + 3x_1^2x_2 + 3x_1x_2^2 + x_2^3 =0\]	\[(x_1 + x_2)^3 = 0\]
\[(4x_1-4x_2-1)(4x_1-4x_2+1)&lt;0\]	\[16\left((x_1+x_2)^2-4x_1x_2\right)-1&lt;0\]
Uwaga! Cały czas rozmawiamy o sytuacji, gdzie równanie ma dwa różne rozwiązania rzeczywiste:<br>\[ x_1^2 - x_2^2 = 0\]	\[x_1 + x_2 = 0\]<br>Można podzielić (przy równaniach, przy nierównościach nie!!) przez \[x_1 - x_2\]
\[x_1^2-x_2^2=x_1^4-x_2^4\]	\[(x_1+x_2)\left((x_1+x_2)^2-2x_1x_2-1\right)=0\]
Wyznacz wszystkie wartości parametru $m$, dla których równanie<br>\[(x-3)\left(x^2+(m-1)x-6m^2+2m\right)=0\]<br>ma dokładnie dwa rozwiązania.	Trzeba rozpatrzeć dwa przypadki:<br>\[\Delta=0 \quad \land \quad x_0\neq 3\]<br>Oraz<br>\[\Delta&gt;0 \quad \land \quad \left(3^2+(m-1)\cdot 3-6m^2+2m=0\right)\](jedno z rozwiązań równania kwadratowego to 3).
Wyznacz wszystkie wartości parametru $m$, dla których nierówność<br>\[(m^2+4m-5)\cdot x^2+2x&gt;2mx-2\]<br>jest prawdziwa dla każdej liczby rzeczywistej $x$.	To jest oczywiście nierówność kwadratowa. Żeby ona była zawsze spełniona, musi być&nbsp;<br>\[ \Delta &lt; 0 \land a &gt; 0\]<br>Co oznacza dokładnie, że parabola jest całkowicie nad osią OX (ramiona skierowane w górę i brak przecięć z osią).
Wyznacz wszystkie wartości parametru $m$, dla których równanie<br>\[x^2-3mx+2m^2+1=0\]<br>ma dwa różne rozwiązania takie, że każde należy do przedziału \[(-\infty,3)\].<br><br>	\[ \Delta &gt; 0, \quad x_1 + x_2 &lt; 6, \quad (x_1 - 3)(x_2 - 3) &gt; 0\]<br><br>Komentarzyk: \[(x_1 - 3)(x_2 - 3) &gt; 0\] zapewnia, że liczby \[x_1 - 3\] oraz \[x_2 - 3\] mają ten sam znak, \[x_1 + x_2 &lt; 6\] mówi że nie są dodatnie.`;

const collections = [
  {
    id: "wzory-vietea-triki",
    title: "Wzory Viete'a - triki",
    description:
      "Warunki na pierwiastki, przekształcenia symetryczne i typowe zadania z parametrem.",
    cards: parseAnkiTsv(vieteRaw),
  },
];

const app = document.querySelector("#app");
const state = {
  selectedCollectionId: null,
  testIndex: 0,
  answerVisible: false,
};

function parseAnkiTsv(raw) {
  return raw
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line, index) => {
      const separatorIndex = line.indexOf("\t");
      return {
        id: index + 1,
        front: line.slice(0, separatorIndex).trim(),
        back: line.slice(separatorIndex + 1).trim(),
      };
    });
}

function getCollection(id) {
  return collections.find((collection) => collection.id === id) ?? collections[0];
}

function route() {
  const hash = window.location.hash || "#/";
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);

  if (parts[0] === "kolekcja") {
    state.selectedCollectionId = parts[1] ?? collections[0].id;

    if (parts[2] === "test") {
      const collection = getCollection(state.selectedCollectionId);
      const requestedIndex = Number.parseInt(parts[3] ?? "1", 10) - 1;
      state.testIndex = clamp(requestedIndex, 0, collection.cards.length - 1);
      state.answerVisible = false;
      renderTest(collection);
      return;
    }

    renderCollection(getCollection(state.selectedCollectionId));
    return;
  }

  state.selectedCollectionId = null;
  renderHome();
}

function renderHome() {
  const totalCards = collections.reduce((sum, collection) => sum + collection.cards.length, 0);

  app.className = "app";
  app.innerHTML = `
    <section class="hero">
      <div>
        <p class="eyebrow">Dzień dobry</p>
        <h1>Fiszki do matury rozszerzonej z matematyki</h1>
        <p class="lead">
          Wybierz kolekcję, przejrzyj przody i tyły fiszek obok siebie, a potem odpal tryb testu na pełnym ekranie.
        </p>
      </div>
      <div class="stats-strip" aria-label="Statystyki fiszek">
        <div class="stat">
          <strong>${collections.length}</strong>
          <span>kolekcja</span>
        </div>
        <div class="stat">
          <strong>${totalCards}</strong>
          <span>fiszek</span>
        </div>
      </div>
    </section>

    <section aria-labelledby="collections-title">
      <div class="section-head">
        <h2 id="collections-title">Kolekcje fiszek</h2>
      </div>
      <div class="collection-grid">
        ${collections.map(renderCollectionCard).join("")}
      </div>
    </section>
  `;

  renderMath(app);
}

function renderCollectionCard(collection) {
  return `
    <a class="collection-card" href="#/kolekcja/${collection.id}">
      <div>
        <h3>${collection.title}</h3>
        <p>${collection.description}</p>
      </div>
      <span class="collection-meta">${collection.cards.length}</span>
    </a>
  `;
}

function renderCollection(collection) {
  app.className = "app";
  app.innerHTML = `
    <section class="view-head">
      <div>
        <p class="eyebrow">Kolekcja</p>
        <h1>${collection.title}</h1>
        <p class="lead">${collection.description}</p>
      </div>
      <div class="view-actions">
        <a class="button secondary" href="#/">Powrót</a>
        <button class="button accent" type="button" data-start-test>Tryb testu</button>
      </div>
    </section>

    <section class="flashcard-list" aria-label="Lista fiszek">
      ${collection.cards.map(renderFlashcardRow).join("")}
    </section>
  `;

  app.querySelector("[data-start-test]").addEventListener("click", () => {
    window.location.hash = `#/kolekcja/${collection.id}/test/1`;
  });

  renderMath(app);
}

function renderFlashcardRow(card) {
  return `
    <article class="flashcard-row">
      <section class="flashcard-side front">
        <span class="card-number">${card.id}</span>
        <span class="side-label">Przód</span>
        <div class="card-content">${card.front}</div>
      </section>
      <section class="flashcard-side back">
        <span class="card-number">${card.id}</span>
        <span class="side-label">Tył</span>
        <div class="card-content">${card.back}</div>
      </section>
    </article>
  `;
}

function renderTest(collection) {
  const card = collection.cards[state.testIndex];
  const isFirst = state.testIndex === 0;
  const isLast = state.testIndex === collection.cards.length - 1;

  app.className = "app test-view";
  app.innerHTML = `
    <header class="test-top">
      <div>
        <p class="eyebrow">Tryb testu</p>
        <strong>${collection.title}</strong>
      </div>
      <span class="test-counter">${state.testIndex + 1} / ${collection.cards.length}</span>
    </header>

    <section class="test-stage" aria-live="polite">
      <article class="test-question">
        <div class="card-content">${card.front}</div>
      </article>
      <article class="test-answer" ${state.answerVisible ? "" : "hidden"}>
        <span class="side-label">Odpowiedź</span>
        <div class="card-content">${card.back}</div>
      </article>
    </section>

    <nav class="test-controls" aria-label="Sterowanie testem">
      <button class="button secondary" type="button" data-prev ${isFirst ? "disabled" : ""}>Poprzednia</button>
      <button class="button warning" type="button" data-answer>${state.answerVisible ? "Ukryj odpowiedź" : "Pokaż odpowiedź"}</button>
      <button class="button secondary" type="button" data-next ${isLast ? "disabled" : ""}>Następna</button>
      <button class="button accent" type="button" data-back>Powrót do fiszek</button>
    </nav>
  `;

  bindTestEvents(collection);
  renderMath(app);
}

function bindTestEvents(collection) {
  app.querySelector("[data-answer]").addEventListener("click", () => {
    state.answerVisible = !state.answerVisible;
    renderTest(collection);
  });

  app.querySelector("[data-prev]").addEventListener("click", () => {
    moveTest(collection, -1);
  });

  app.querySelector("[data-next]").addEventListener("click", () => {
    moveTest(collection, 1);
  });

  app.querySelector("[data-back]").addEventListener("click", () => {
    window.location.hash = `#/kolekcja/${collection.id}`;
  });
}

function moveTest(collection, direction) {
  const nextIndex = clamp(state.testIndex + direction, 0, collection.cards.length - 1);

  if (nextIndex === state.testIndex) {
    return;
  }

  state.testIndex = nextIndex;
  state.answerVisible = false;
  window.location.hash = `#/kolekcja/${collection.id}/test/${state.testIndex + 1}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(Number.isNaN(value) ? min : value, min), max);
}

function renderMath(scope) {
  if (!window.MathJax?.typesetPromise) {
    return;
  }

  window.MathJax.typesetClear?.([scope]);
  window.MathJax.typesetPromise([scope]).catch((error) => {
    console.error("Nie udało się wyrenderować LaTeX-a:", error);
  });
}

window.addEventListener("hashchange", route);
window.addEventListener("mathjax-ready", () => renderMath(app));
window.addEventListener("keydown", (event) => {
  if (!app.classList.contains("test-view")) {
    return;
  }

  const collection = getCollection(state.selectedCollectionId);
  if (event.key === "ArrowLeft") {
    moveTest(collection, -1);
  }

  if (event.key === "ArrowRight") {
    moveTest(collection, 1);
  }

  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    state.answerVisible = !state.answerVisible;
    renderTest(collection);
  }

  if (event.key === "Escape") {
    window.location.hash = `#/kolekcja/${collection.id}`;
  }
});

route();
