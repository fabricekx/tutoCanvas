/* pour résoudre le problème de pause qui est défini dans direction, mais sert dans snake.js
  qui s'exécute avant.
  Donc ordre de déclaration dans le html:
   <script src="gameState.js"></script>
    <script src="snake.js"></script>
    <script src="direction.js"></script>

*/

const gameState = {
  pause: false,
  running: true,
};
