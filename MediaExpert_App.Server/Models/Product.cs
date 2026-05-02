namespace MediaExpert_App.Server.Models
{
    public class Product
    {
        public int Id { get; set; } = 0;
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
