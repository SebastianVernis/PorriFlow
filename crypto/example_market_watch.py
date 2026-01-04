"""
Example CLI for Live Market Watch using Rich
"""
import time
import argparse
from rich.console import Console
from rich.live import Live
from rich.panel import Panel
from rich.align import Align
from rich.text import Text

from bet_copilot.ui.market_watch import MarketWatchTable, create_value_bets_table
from bet_copilot.ui.mock_data import generate_mock_markets
from bet_copilot.ui.styles import NEON_THEME, NEON_CYAN, NEON_PURPLE, NEON_GREEN


def example_static_display():
    """Example 1: Static display of market watch"""
    console = Console(theme=NEON_THEME)
    
    console.print("\n")
    console.print(Panel(
        Align.center(Text("EXAMPLE 1: Static Market Watch", style=f"bold {NEON_PURPLE}")),
        border_style=NEON_CYAN
    ))
    console.print("\n")
    
    # Generate mock data
    markets = generate_mock_markets(count=15, seed=42)
    
    # Create and render table
    watch = MarketWatchTable(console=console)
    watch.render(markets)
    
    console.print("\n")


def example_compact_mode():
    """Example 2: Compact mode for narrow terminals"""
    console = Console(theme=NEON_THEME)
    
    console.print("\n")
    console.print(Panel(
        Align.center(Text("EXAMPLE 2: Compact Mode", style=f"bold {NEON_PURPLE}")),
        border_style=NEON_CYAN
    ))
    console.print("\n")
    
    # Generate mock data
    markets = generate_mock_markets(count=10, seed=123)
    
    # Force compact mode
    watch = MarketWatchTable(console=console, compact_mode=True)
    watch.render_simple(markets)
    
    console.print("\n")


def example_value_bets_only():
    """Example 3: Show only high-value bets"""
    console = Console(theme=NEON_THEME)
    
    console.print("\n")
    console.print(Panel(
        Align.center(Text("EXAMPLE 3: Value Bets Only (EV ≥ 5%)", style=f"bold {NEON_PURPLE}")),
        border_style=NEON_CYAN
    ))
    console.print("\n")
    
    # Generate mock data
    markets = generate_mock_markets(count=25, seed=456)
    
    # Create value bets table
    table = create_value_bets_table(markets, min_ev=0.05)
    console.print(Align.center(table))
    
    console.print("\n")


def example_live_updates(duration: int = 15):
    """Example 4: Live updating display"""
    console = Console(theme=NEON_THEME)
    
    console.print("\n")
    console.print(Panel(
        Align.center(Text(f"EXAMPLE 4: Live Updates ({duration}s)", style=f"bold {NEON_PURPLE}")),
        border_style=NEON_CYAN
    ))
    console.print("\n")
    
    watch = MarketWatchTable(console=console)
    
    with Live(console=console, refresh_per_second=1) as live:
        for i in range(duration):
            # Generate new data each iteration
            markets = generate_mock_markets(count=12, seed=i)
            layout = watch.create_layout(markets)
            live.update(layout)
            time.sleep(1)
    
    console.print("\n")


def example_different_views():
    """Example 5: Different view configurations"""
    console = Console(theme=NEON_THEME)
    
    console.print("\n")
    console.print(Panel(
        Align.center(Text("EXAMPLE 5: Different View Configurations", style=f"bold {NEON_PURPLE}")),
        border_style=NEON_CYAN
    ))
    
    markets = generate_mock_markets(count=10, seed=789)
    
    # View 1: Full mode with all details
    console.print("\n[bold]📊 Full Mode (All Details)[/]\n")
    watch_full = MarketWatchTable(console=console, show_xg=True, show_time=True)
    watch_full.render_simple(markets, title="FULL MODE")
    
    # View 2: Without xG
    console.print("\n[bold]📈 Without xG[/]\n")
    watch_no_xg = MarketWatchTable(console=console, show_xg=False, show_time=True)
    watch_no_xg.render_simple(markets, title="NO XG MODE")
    
    # View 3: Minimal (no time, no xG)
    console.print("\n[bold]⚡ Minimal Mode[/]\n")
    watch_minimal = MarketWatchTable(console=console, show_xg=False, show_time=False)
    watch_minimal.render_simple(markets, title="MINIMAL MODE")
    
    console.print("\n")


def example_sorted_by_criteria():
    """Example 6: Markets sorted by different criteria"""
    console = Console(theme=NEON_THEME)
    
    console.print("\n")
    console.print(Panel(
        Align.center(Text("EXAMPLE 6: Sorted Markets", style=f"bold {NEON_PURPLE}")),
        border_style=NEON_CYAN
    ))
    
    markets = generate_mock_markets(count=20, seed=999)
    watch = MarketWatchTable(console=console)
    
    # Sort by EV (default)
    console.print("\n[bold]💰 Top Markets by EV[/]\n")
    top_ev = sorted(markets, key=lambda m: m.ev, reverse=True)[:8]
    watch.render_simple(top_ev, title="HIGHEST EV")
    
    # Sort by confidence
    console.print("\n[bold]🎯 Highest Confidence Bets[/]\n")
    top_conf = sorted(markets, key=lambda m: m.confidence, reverse=True)[:8]
    watch.render_simple(top_conf, title="HIGHEST CONFIDENCE")
    
    # Sort by time (soonest first)
    console.print("\n[bold]⏰ Upcoming Matches[/]\n")
    upcoming = sorted(markets, key=lambda m: m.commence_time)[:8]
    watch.render_simple(upcoming, title="UPCOMING")
    
    console.print("\n")


def example_league_filter():
    """Example 7: Filter by league"""
    console = Console(theme=NEON_THEME)
    
    console.print("\n")
    console.print(Panel(
        Align.center(Text("EXAMPLE 7: League-Specific Views", style=f"bold {NEON_PURPLE}")),
        border_style=NEON_CYAN
    ))
    
    markets = generate_mock_markets(count=30, seed=111)
    watch = MarketWatchTable(console=console)
    
    # Group by league
    leagues = {}
    for market in markets:
        league = market.league
        if league not in leagues:
            leagues[league] = []
        leagues[league].append(market)
    
    # Show each league
    for league, league_markets in list(leagues.items())[:3]:  # First 3 leagues
        console.print(f"\n[bold]{league}[/]\n")
        watch.render_simple(league_markets[:5], title=league)
    
    console.print("\n")


def example_interactive_menu():
    """Example 8: Interactive menu selection"""
    console = Console(theme=NEON_THEME)
    
    console.print("\n")
    console.print(Panel(
        Align.center(Text("EXAMPLE 8: Interactive Selection", style=f"bold {NEON_PURPLE}")),
        border_style=NEON_CYAN
    ))
    console.print("\n")
    
    markets = generate_mock_markets(count=10, seed=222)
    watch = MarketWatchTable(console=console)
    
    # Display table
    watch.render_simple(markets)
    
    # Show detailed view of top value bet
    top_bet = markets[0]
    
    console.print(f"\n[bold {NEON_GREEN}]💎 TOP VALUE BET DETAILS[/]\n")
    
    detail_text = Text()
    detail_text.append(f"{top_bet.home_team} vs {top_bet.away_team}\n", style=f"bold {NEON_CYAN}")
    detail_text.append(f"League: {top_bet.league}\n", style="dim")
    detail_text.append(f"Market: {top_bet.market_type}\n\n", style=NEON_CYAN)
    
    detail_text.append("Model Analysis:\n", style="bold")
    detail_text.append(f"  Expected Goals: {top_bet.home_lambda:.2f} - {top_bet.away_lambda:.2f}\n", style="dim")
    detail_text.append(f"  Model Probability: {top_bet.model_prob:.1%}\n", style="dim")
    detail_text.append(f"  Most Likely Score: {top_bet.most_likely_score}\n", style="dim")
    detail_text.append(f"  Confidence: {top_bet.confidence:.1%}\n\n", style="dim")
    
    detail_text.append("Bookmaker:\n", style="bold")
    detail_text.append(f"  {top_bet.bookmaker}\n", style="dim")
    detail_text.append(f"  Odds: {top_bet.odds:.2f}\n", style="dim")
    detail_text.append(f"  Implied Probability: {top_bet.implied_prob:.1%}\n\n", style="dim")
    
    ev_color = NEON_GREEN if top_bet.ev > 0 else "red"
    detail_text.append("Expected Value:\n", style="bold")
    detail_text.append(f"  {top_bet.ev:+.1%}", style=f"bold {ev_color}")
    
    if top_bet.ev > 0.05:
        detail_text.append(" 🔥 HIGH VALUE!", style=f"bold {NEON_GREEN}")
    
    panel = Panel(
        detail_text,
        border_style=NEON_GREEN,
        padding=(1, 2)
    )
    
    console.print(Align.center(panel))
    console.print("\n")


def main():
    """Main entry point with CLI arguments"""
    parser = argparse.ArgumentParser(
        description="Bet-Copilot Live Market Watch Demo",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument(
        "--example",
        type=int,
        choices=range(1, 9),
        help="Run specific example (1-8)"
    )
    
    parser.add_argument(
        "--live",
        action="store_true",
        help="Run live updating display"
    )
    
    parser.add_argument(
        "--duration",
        type=int,
        default=15,
        help="Duration for live updates (default: 15s)"
    )
    
    parser.add_argument(
        "--compact",
        action="store_true",
        help="Force compact mode"
    )
    
    args = parser.parse_args()
    
    console = Console(theme=NEON_THEME)
    
    # Welcome banner
    console.print("\n")
    console.print(Panel(
        Align.center(Text("⚡ BET-COPILOT ⚡\nLive Market Watch Demo", 
                         style=f"bold {NEON_PURPLE}", justify="center")),
        border_style=NEON_CYAN,
        padding=(1, 2)
    ))
    
    if args.live:
        example_live_updates(args.duration)
    elif args.example:
        examples = {
            1: example_static_display,
            2: example_compact_mode,
            3: example_value_bets_only,
            4: lambda: example_live_updates(args.duration),
            5: example_different_views,
            6: example_sorted_by_criteria,
            7: example_league_filter,
            8: example_interactive_menu,
        }
        examples[args.example]()
    else:
        # Run all examples
        example_static_display()
        input("\nPress Enter to continue to next example...")
        
        example_compact_mode()
        input("\nPress Enter to continue to next example...")
        
        example_value_bets_only()
        input("\nPress Enter to continue to next example...")
        
        example_different_views()
        input("\nPress Enter to continue to next example...")
        
        example_sorted_by_criteria()
        input("\nPress Enter to continue to next example...")
        
        example_league_filter()
        input("\nPress Enter to continue to next example...")
        
        example_interactive_menu()
        
        console.print("\n[bold]Run with --live flag for live updating display[/]\n")


if __name__ == "__main__":
    main()
