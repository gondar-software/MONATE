namespace Ecommerces.BlockChain
{
    using System.Collections;

    public class BlockChain : IEnumerable<IBlock>
    {
        private readonly List<IBlock> _items = new List<IBlock>();

        public int Count => _items.Count;

        public byte[] Difficulty { get; }

        public IBlock this[int index]
        {
            get => _items[index];
            set => _items[index] = value;
        }

        public List<IBlock> Items => _items;

        public BlockChain(byte[] difficulty, IBlock genesis)
        {
            Difficulty = difficulty;
            genesis.Hash = genesis.MineHash(difficulty);
            Items.Add(genesis);
        }

        public void Add(IBlock item)
        {
            if (Items.LastOrDefault() != null)
            {
                item.PrevHash = Items.LastOrDefault()?.Hash ?? [];
            }

            item.Hash = item.MineHash(Difficulty);
            Items.Add(item);
        }

        public IEnumerator<IBlock> GetEnumerator()
        {
            return _items.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return _items.GetEnumerator();
        }
    }
}
