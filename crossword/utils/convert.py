from puz import Puzzle, Grid

def puz_to_json(puzzle: Puzzle) -> dict:
    """Grid """
    """Across Hints"""
    """Down Hints"""
    json = {}

    solution = Grid(puzzle.solution, puzzle.width, puzzle.height)

    grid = []
    for row in range(puzzle.height):
        grid.append(''.join(solution.get_row(row)).replace('.', '#'))
    json['grid'] = grid

    across_hints = []
    for clue in puzzle.clue_numbering().across:
        across_hints.append({
            'clue'  : clue['clue'],
            'number': clue['num' ],
            'row'   : clue['row' ],
            'col'   : clue['col' ]
        })
    json['across'] = across_hints

    down_hints = []
    for clue in puzzle.clue_numbering().down:
        down_hints.append({
            'clue'  : clue['clue'],
            'number': clue['num' ],
            'row'   : clue['row' ],
            'col'   : clue['col' ]
        })
    json['down'] = down_hints

    return json