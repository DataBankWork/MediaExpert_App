using MediaExpert_App.Server.Data;
using MediaExpert_App.Server.Interfaces;
using MediaExpert_App.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediaExpert_App.Server.Controllers
{
    //Założenie: docelowo przełączenie na klasyczną bazę danych dlatego kontrolery asynchroniczne
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpGet("get_paged_search")]
        public async Task<ActionResult<PagedResult<Product>>> GetPagedSearch([FromQuery] string? searchTerm,
            [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _productService.GetPagedSearchAsync(pageNumber, pageSize, searchTerm);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Product>> Create([FromBody] Product product)
        {
            var created = await _productService.CreateAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut]
        public async Task<IActionResult> Update(Product product)
        {
            var success = await _productService.UpdateAsync(product);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")] 
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _productService.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent(); 
        }

        [HttpDelete("delete_range")]
        public async Task<IActionResult> DeleteRange([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("Lista identyfikatorów nie może być pusta.");
            }

            var success = await _productService.DeleteRangeAsync(ids);

            if (!success)
            {
                return NotFound("Nie znaleziono niektórych lub wszystkich elementów.");
            }

            return NoContent();
        }

        
    }
}
