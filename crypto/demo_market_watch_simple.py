"""
Standalone Live Market Watch Demo with Rich
Minimal dependencies - everything in one file
"""
import random
from datetime import datetime, timedelta
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.layout import Layout
from rich.text import Text
from rich.align import Align
from rich.box import MINIMAL, ROUNDED
from rich.theme import Theme

# Neon colors
NEON_GREEN = "#39FF14"
NEON_CYAN = "#00FFFF"
NEON_PINK = "#FF10F0"
NEON_YELLOW = "#FFFF00"
NEON_PURPLE = "#9D00FF"
NEON_RED = "#FF073A"
LIGHT_GRAY = "#CCCCCC"

# Theme
THEME = Theme({
    "title": f"bold {NEON_PURPLE}",
    "highlight": f"bold {NEON_GREEN}",
})


def generate_mock_data(count=12):
    """Generate mock market data"""
    random.seed(42)
    
    teams = [
        ("Arsenal", "Man City"), ("Real Madrid", "Barcelona"),
        ("Inter Milan", "AC Milan"), ("Bayern", "Dortmund"),
        ("PSG", "Marseille"), ("Liverpool", "Chelsea"),
        ("Atletico", "Sevilla"), ("Napoli", "Juventus"),
        ("Leipzig", "Leverkusen"), ("Monaco", "Lyon"),
    ]
    
    leagues = ["🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL", "🇪🇸 LaLiga", "🇮🇹 SerieA", "🇩🇪 Bund", "🇫🇷 L1"]
    markets = ["Home Win", "Draw", "Away Win", "Over 2.5", "BTTS Yes"]
    bookmakers = ["Bet365", "Pinnacle", "Betfair"]
    
    data = []
    for i in range(count):
        home, away = random.choice(teams)
        
        # Model probability
        model_prob = random.uniform(0.25, 0.75)
        
        # Bookmaker odds (with noise for value)
        noise = random.uniform(-0.15, 0.15)
        implied = max(0.1, min(0.9, model_prob + noise))
        odds = round(1 / implied, 2)
        
        # EV calculation
        ev = (model_prob * odds) - 1
        
        # xG values
        home_xg = round(random.uniform(0.8, 2.8), 1)
        away_xg = round(random.uniform(0.8, 2.8), 1)
        
        # Time
        hours = random.randint(1, 72)
        commence = datetime.now() + timedelta(hours=hours)
        
        data.append({
            "home": home,
            "away": away,
            "league": random.choice(leagues),
            "market": random.choice(markets),
            "model_prob": model_prob,
            "odds": odds,
            "ev": ev,
            "bookmaker": random.choice(bookmakers),
            "home_xg": home_xg,
            "away_xg": away_xg,
            "hours": hours,
        })
    
    # Sort by EV
    data.sort(key=lambda x: x["ev"], reverse=True)
    return data


def format_ev(ev):
    """Format EV with color"""
    if ev > 0.05:
        color = NEON_GREEN
        style = "bold"
    elif ev > 0:
        color = NEON_YELLOW
        style = ""
    else:
        color = NEON_RED
        style = "dim"
    
    sign = "+" if ev > 0 else ""
    return f"[{style} {color}]{sign}{ev:.1%}[/]"


def format_indicator(ev):
    """EV indicator"""
    if ev > 0.05:
        return f"[{NEON_GREEN}]●[/]"
    elif ev > 0:
        return f"[{NEON_YELLOW}]●[/]"
    else:
        return "[dim]○[/]"


def create_market_table(data):
    """Create the main market watch table"""
    table = Table(
        title=f"[{NEON_PURPLE}]⚡ LIVE MARKET WATCH ⚡[/]",
        box=MINIMAL,
        show_header=True,
        header_style=f"bold {NEON_CYAN}",
        border_style=LIGHT_GRAY,
        expand=False,
        padding=(0, 1),
    )
    
    # Columns
    table.add_column("", justify="center", width=2)
    table.add_column("Match", justify="left", style=LIGHT_GRAY, width=26)
    table.add_column("League", justify="left", style="dim", width=10)
    table.add_column("Market", justify="left", style=NEON_YELLOW, width=10)
    table.add_column("Model", justify="right", width=7)
    table.add_column("Odds", justify="right", width=6)
    table.add_column("EV", justify="right", width=8)
    table.add_column("xG", justify="center", style="dim", width=8)
    table.add_column("⏰", justify="center", width=5)
    
    # Rows
    for item in data:
        # Format match
        home = f"[{NEON_CYAN}]{item['home']}[/]"
        away = f"[{NEON_PINK}]{item['away']}[/]"
        match = f"{home} vs {away}"
        
        # League (short)
        league = item["league"].split()[1] if len(item["league"].split()) > 1 else item["league"]
        
        # Model
        model_str = f"[{NEON_CYAN}]{item['model_prob']:.1%}[/]"
        
        # Odds
        odds_str = f"[{LIGHT_GRAY}]{item['odds']:.2f}[/]"
        
        # EV
        ev_str = format_ev(item["ev"])
        
        # xG
        xg_str = f"[dim]{item['home_xg']:.1f}-{item['away_xg']:.1f}[/]"
        
        # Time
        hours = item["hours"]
        if hours < 3:
            time_str = f"[{NEON_RED}]{hours}h[/]"
        elif hours < 12:
            time_str = f"[{NEON_YELLOW}]{hours}h[/]"
        else:
            days = hours // 24
            time_str = f"[dim]{days}d[/]"
        
        table.add_row(
            format_indicator(item["ev"]),
            match,
            league,
            item["market"],
            model_str,
            odds_str,
            ev_str,
            xg_str,
            time_str
        )
    
    return table


def create_header(data):
    """Create header with stats"""
    positive_ev = sum(1 for x in data if x["ev"] > 0)
    high_value = sum(1 for x in data if x["ev"] > 0.05)
    avg_ev = sum(x["ev"] for x in data) / len(data)
    
    text = Text()
    text.append("⚡ ", style=NEON_YELLOW)
    text.append("BET-COPILOT", style=f"bold {NEON_PURPLE}")
    text.append(" | Live Market Watch\n\n", style=NEON_CYAN)
    
    text.append(f"Markets: ", style="dim")
    text.append(f"{len(data)} ", style=f"bold {NEON_CYAN}")
    
    text.append(f"| +EV: ", style="dim")
    text.append(f"{positive_ev} ", style=f"bold {NEON_GREEN}")
    
    text.append(f"| High Value: ", style="dim")
    text.append(f"{high_value} ", style=f"bold {NEON_YELLOW}")
    
    text.append(f"| Avg EV: ", style="dim")
    ev_color = NEON_GREEN if avg_ev > 0 else NEON_RED
    text.append(f"{avg_ev:+.1%}", style=ev_color)
    
    return Panel(
        Align.center(text),
        border_style=LIGHT_GRAY,
        box=MINIMAL,
    )


def create_footer():
    """Create footer with legend"""
    text = Text()
    text.append("Legend: ", style="dim")
    text.append("● ", style=f"bold {NEON_GREEN}")
    text.append("High Value (>5%)  ", style="dim")
    text.append("● ", style=f"bold {NEON_YELLOW}")
    text.append("Positive EV  ", style="dim")
    text.append("○ ", style="dim")
    text.append("Negative EV  ", style="dim")
    
    text.append("| ", style="dim")
    text.append(f"Updated: {datetime.now().strftime('%H:%M:%S')}", style="dim")
    
    return Panel(
        Align.center(text),
        border_style=LIGHT_GRAY,
        box=MINIMAL,
    )


def create_value_table(data, min_ev=0.05):
    """Create focused value bets table"""
    value_data = [x for x in data if x["ev"] >= min_ev]
    
    table = Table(
        title=f"[{NEON_GREEN}]💎 VALUE BETS (EV ≥ {min_ev:.0%})[/]",
        box=ROUNDED,
        show_header=True,
        header_style=f"bold {NEON_GREEN}",
        border_style=NEON_GREEN,
        expand=False,
        padding=(0, 1),
    )
    
    table.add_column("Match", justify="left", width=22)
    table.add_column("Market", justify="left", width=10)
    table.add_column("Model", justify="right", width=7)
    table.add_column("Odds", justify="right", width=6)
    table.add_column("EV", justify="right", width=8)
    
    for item in value_data:
        match = f"[{NEON_CYAN}]{item['home'][:8]}[/] v [{NEON_PINK}]{item['away'][:8]}[/]"
        model = f"{item['model_prob']:.1%}"
        odds = f"{item['odds']:.2f}"
        ev = format_ev(item["ev"])
        
        table.add_row(match, item["market"], model, odds, ev)
    
    if not value_data:
        table.add_row("[dim]No value bets found[/]", "", "", "", "")
    
    return table


def main():
    """Main demo"""
    console = Console(theme=THEME)
    
    # Welcome
    console.print("\n")
    console.print(Panel(
        Align.center(Text("⚡ BET-COPILOT ⚡\nLive Market Watch\nZona C: Live Market Watch Demo", 
                         style=f"bold {NEON_PURPLE}", justify="center")),
        border_style=NEON_CYAN,
        padding=(1, 2)
    ))
    console.print("\n")
    
    # Generate mock data
    data = generate_mock_data(count=15)
    
    # Display 1: Full layout
    console.print(Panel(
        Text("LAYOUT 1: Full Market Watch", style=f"bold {NEON_CYAN}", justify="center"),
        border_style=NEON_CYAN
    ))
    console.print()
    
    layout = Layout()
    layout.split_column(
        Layout(create_header(data), size=5),
        Layout(Align.center(create_market_table(data)), name="table"),
        Layout(create_footer(), size=3),
    )
    console.print(layout)
    
    # Display 2: Value bets only
    console.print("\n")
    console.print(Panel(
        Text("LAYOUT 2: Value Bets Focus", style=f"bold {NEON_CYAN}", justify="center"),
        border_style=NEON_CYAN
    ))
    console.print()
    
    value_table = create_value_table(data, min_ev=0.05)
    console.print(Align.center(value_table))
    
    # Summary
    console.print("\n")
    summary = Text()
    summary.append("✓ ", style=NEON_GREEN)
    summary.append("Features Demonstrated:\n", style="bold")
    summary.append("  • Minimalist borders (", style="dim")
    summary.append("MINIMAL", style=NEON_CYAN)
    summary.append(" box)\n", style="dim")
    summary.append("  • Neon color scheme for EV values (", style="dim")
    summary.append("green", style=NEON_GREEN)
    summary.append("/", style="dim")
    summary.append("yellow", style=NEON_YELLOW)
    summary.append("/", style="dim")
    summary.append("red", style=NEON_RED)
    summary.append(")\n", style="dim")
    summary.append("  • Responsive to terminal width\n", style="dim")
    summary.append("  • Real-time data structure\n", style="dim")
    summary.append("  • Value indicators (● symbols)\n", style="dim")
    summary.append("  • xG integration\n", style="dim")
    summary.append("  • Time-to-event display\n", style="dim")
    
    console.print(Panel(summary, border_style=LIGHT_GRAY, padding=(1, 2)))
    console.print("\n")


if __name__ == "__main__":
    main()
